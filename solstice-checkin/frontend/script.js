const attendeeIdInput = document.getElementById("attendeeId");
const checkInButton = document.getElementById("checkInButton");
const status = document.getElementById("status");
const attendeeList = document.getElementById("attendeeList");

async function loadAttendees() {
  const response = await fetch("/attendees");

  const attendees = await response.json();

  attendeeList.innerHTML = "";

  attendees.forEach((attendee) => {
    const attendeeElement = document.createElement("div");

    attendeeElement.classList.add("attendee");

    let statusText = "";
    let statusClass = "";

    if (attendee.status === "CHECKED_IN") {
      statusText = "✓ Checked In";
      statusClass = "status-checked";
    } else if (attendee.status === "PENDING") {
      statusText = "⏳ Printing...";
      statusClass = "status-pending";
    } else {
      statusText = "Not Checked In";
      statusClass = "status-pending";
    }

    attendeeElement.innerHTML = `
      <div>
        <strong>${attendee.id}</strong>
        <span>${attendee.name}</span>
      </div>

      <span class="${statusClass}">
        ${statusText}
      </span>
    `;

    attendeeList.appendChild(attendeeElement);
  });
}

loadAttendees();

checkInButton.addEventListener("click", async () => {
  const attendeeId = attendeeIdInput.value.trim();

  if (!attendeeId) {
    status.textContent = "Please enter an attendee ID.";
    return;
  }

  status.textContent = "Sending print request...";

  const response = await fetch("/check-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attendeeId: attendeeId,
    }),
  });

  const result = await response.json();

  status.textContent = result.message;

  if (result.success) {
    attendeeIdInput.value = "";
    await loadAttendees();
  }
});

// Check for status changes every second
setInterval(loadAttendees, 1000);