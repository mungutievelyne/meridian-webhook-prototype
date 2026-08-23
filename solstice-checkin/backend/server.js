const http = require("http");
const fs = require("fs");
const path = require("path");

const attendees = [
  {
    id: "A001",
    name: "Mary Mbugua",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A002",
    name: "Faith Omondi",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A003",
    name: "Keith Kazungu",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A004",
    name: "Gloria Ummy",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A005",
    name: "Eunice Njeri",
    status: "NOT_CHECKED_IN",
  },
];

const printQueue = [];

function publishPrintRequest(attendee) {
  printQueue.push({
    attendeeId: attendee.id,
    name: attendee.name,
  });

  console.log(`Print request queued for ${attendee.name}`);
}

function processPrintQueue() {
  if (printQueue.length === 0) {
    return;
  }

  const job = printQueue.shift();

  console.log(`Printing badge for ${job.name}...`);

  setTimeout(() => {
    console.log(`Badge printed for ${job.name}`);

    // Simulate the badge-printer vendor
    // calling our webhook after printing succeeds.
    sendWebhook(job.attendeeId);
  }, 2000);
}

setInterval(processPrintQueue, 500);

function sendWebhook(attendeeId) {
  const webhookData = JSON.stringify({
    attendeeId: attendeeId,
    success: true,
    message: "Badge printed successfully",
  });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/webhook",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(webhookData),
    },
  };

  const webhookRequest = http.request(options);

  webhookRequest.on("error", (error) => {
    console.error("Webhook error:", error.message);
  });

  webhookRequest.write(webhookData);
  webhookRequest.end();
}

const server = http.createServer((req, res) => {
  // Serve the frontend
  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "../frontend/index.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Unable to load the page");
        return;
      }

      res.setHeader("Content-Type", "text/html");
      res.end(data);
    });

    return;
  }

  // Serve CSS
  if (req.method === "GET" && req.url === "/style.css") {
    const filePath = path.join(__dirname, "../frontend/style.css");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Unable to load stylesheet");
        return;
      }

      res.setHeader("Content-Type", "text/css");
      res.end(data);
    });

    return;
  }

  // Serve JavaScript
  if (req.method === "GET" && req.url === "/script.js") {
    const filePath = path.join(__dirname, "../frontend/script.js");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Unable to load JavaScript");
        return;
      }

      res.setHeader("Content-Type", "application/javascript");
      res.end(data);
    });

    return;
  }

  // Get attendees
  if (req.method === "GET" && req.url === "/attendees") {
    res.setHeader("Content-Type", "application/json");

    res.end(JSON.stringify(attendees));

    return;
  }

  // Start check-in
  if (req.method === "POST" && req.url === "/check-in") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const data = JSON.parse(body);

      const attendee = attendees.find(
        (person) => person.id === data.attendeeId,
      );

      // Attendee doesn't exist
      if (!attendee) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");

        res.end(
          JSON.stringify({
            success: false,
            message: "Attendee not found",
          }),
        );

        return;
      }

      // Already completely checked in
      if (attendee.status === "CHECKED_IN") {
        res.statusCode = 409;
        res.setHeader("Content-Type", "application/json");

        res.end(
          JSON.stringify({
            success: false,
            message: `${attendee.name} is already checked in`,
          }),
        );

        return;
      }

      // Badge is already being printed
      if (attendee.status === "PENDING") {
        res.statusCode = 409;
        res.setHeader("Content-Type", "application/json");

        res.end(
          JSON.stringify({
            success: false,
            message: `${attendee.name}'s badge is already being printed`,
          }),
        );

        return;
      }

      // Move attendee into pending state
      attendee.status = "PENDING";

      // Publish print request to the queue
      publishPrintRequest(attendee);

      // Respond immediately — we DO NOT wait for the printer
      res.setHeader("Content-Type", "application/json");

      res.end(
        JSON.stringify({
          success: true,
          message: `Badge printing started for ${attendee.name}`,
          attendee: attendee,
        }),
      );

    });

    return;
  }

  // Webhook from badge printer
  if (req.method === "POST" && req.url === "/webhook") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const data = JSON.parse(body);

      const attendee = attendees.find(
        (person) => person.id === data.attendeeId,
      );

      if (!attendee) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");

        res.end(
          JSON.stringify({
            success: false,
            message: "Attendee not found",
          }),
        );

        return;
      }

      if (data.success) {
        attendee.status = "CHECKED_IN";

        console.log(
          `Webhook received: ${attendee.name} is now checked in.`,
        );
      }

      res.setHeader("Content-Type", "application/json");

      res.end(
        JSON.stringify({
          success: true,
          message: "Webhook received",
          attendee: attendee,
        }),
      );
    });

    return;
  }

  // Unknown route
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      success: false,
      message: "Route not found",
    }),
  );
});

server.listen(3000, () => {
  console.log("Solstice Check-In running on port 3000");
});