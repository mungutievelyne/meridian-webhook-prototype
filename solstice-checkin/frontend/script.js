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

    attendeeElement.innerHTML = `
            <div>
                <strong>${attendee.id}</strong>
                <span>${attendee.name}</span>
            </div>

            <span class="${
              attendee.checkedIn ? "status-checked" : "status-pending"
            }">
                ${attendee.checkedIn ? "✓ Checked In" : "Not Checked In"}
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

  status.textContent = "Printing badge...";

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
