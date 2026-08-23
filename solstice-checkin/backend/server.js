const http = require("http");

const attendees = [
  {
    id: "A001",
    name: "Mary Mbugua",
    checkedIn: false,
  },
  {
    id: "A002",
    name: "Faith Omondi",
    checkedIn: false,
  },
  {
    id: "A003",
    name: "Keith Kazungu",
    checkedIn: false,
  },
  {
    id: "A004",
    name: "Gloria Ummy",
    checkedIn: false,
  },
  {
    id: "A005",
    name: "Eunice Njeri",
    checkedIn: false,
  },
];

function printBadge(attendee) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: `Badge printed for ${attendee.name}`
            });
        }, 2000);
    });
}

const server = http.createServer((req, res) => {


    if (req.method === 'GET' && req.url === '/attendees') {

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify(attendees));    
    }
    else if (req.method === 'POST' && req.url === '/check-in') {

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        const data = JSON.parse(body);
        const attendee = attendees.find((person) => person.id === data.attendeeId);

        if (!attendee) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify({
        success: false,
        message: 'Attendee not found'
    }));

    return;
}

if (attendee.checkedIn) {
    res.statusCode = 409;
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify({
        success: false,
        message: `${attendee.name} is already checked in`
    }));

    return;
}
const result = await printBadge(attendee);

if (result.success) {
    attendee.checkedIn = true;
}

res.setHeader('Content-Type', 'application/json');

res.end(JSON.stringify({
    success: true,
    message: result.message,
    attendee: attendee
}));

    });
}

});

server.listen(3000, () => {
  console.log("Solstice Check-In running on port 3000");
});
