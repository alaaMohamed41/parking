const spots = [
  { id: 1, status: "free", phone: null },
  { id: 2, status: "free", phone: null },
  { id: 3, status: "free", phone: null },
  { id: 4, status: "free", phone: null },
  { id: 5, status: "free", phone: null },
  { id: 6, status: "free", phone: null }
];

function renderSpots() {
  const grid = document.getElementById("parking-grid");
  grid.innerHTML = "";

  spots.forEach(s => {
    const div = document.createElement("div");
    div.className = `spot ${s.status}`;
    div.textContent = `Spot ${s.id}`;
    grid.appendChild(div);
  });

  updateSummary();
}

function updateSummary() {
  document.getElementById("availableCount").textContent =
    spots.filter(s => s.status === "free").length;

  document.getElementById("reservedCount").textContent =
    spots.filter(s => s.status === "reserved").length;

  document.getElementById("occupiedCount").textContent =
    spots.filter(s => s.status === "occupied").length;

  document.getElementById("lastUpdate").textContent =
    new Date().toLocaleTimeString();
}

function openBooking() {
  document.getElementById("bookingModal").classList.remove("hidden");

  const select = document.getElementById("bookSpot");
  select.innerHTML = "";

  spots.filter(s => s.status === "free").forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `Spot ${s.id}`;
    select.appendChild(opt);
  });

  updateBookingPrice();
}

function closeBooking() {
  document.getElementById("bookingModal").classList.add("hidden");
}

function updateBookingPrice() {
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  if (!start || !end) {
    document.getElementById("bookingPrice").textContent = "0";
    return;
  }

  const startDate = new Date(`2000-01-01T${start}:00`);
  const endDate = new Date(`2000-01-01T${end}:00`);

  let hours = (endDate - startDate) / (1000 * 60 * 60);

  // لو الوقت غلط (زي 10 → 08)
  if (hours <= 0) {
    document.getElementById("bookingPrice").textContent = "0";
    return;
  }

  const price = hours * 30; // 30 EGP/hour
  document.getElementById("bookingPrice").textContent = price;
}


function submitReservation() {
  const name = document.getElementById("bookName").value.trim();
  const phone = document.getElementById("bookPhone").value.trim();
  const spotId = Number(document.getElementById("bookSpot").value);

  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  // basic validation
  if (!name || !phone || !start || !end) {
    return alert("Please fill all fields.");
  }

  // convert to Date objects to calculate hours
  const startDate = new Date(`2000-01-01T${start}:00`);
  const endDate = new Date(`2000-01-01T${end}:00`);

  let hours = (endDate - startDate) / (1000 * 60 * 60);

  if (hours <= 0) {
    return alert("End time must be later than start time.");
  }

  const price = hours * 30;

  // find the spot
  const spot = spots.find(s => s.id === spotId);

  // saving reservation inside spot object
  spot.status = "reserved";
  spot.phone = phone;
  spot.name = name;
  spot.start = start;
  spot.end = end;
  spot.price = price;

  // re-render UI
  renderSpots();
  updateSummary();
  closeBooking();

  alert(`Reservation confirmed!\n\nTotal Price: ${price} EGP`);
}


function openCancelModal() {
  document.getElementById("cancelModal").classList.remove("hidden");
}

function closeCancelModal() {
  document.getElementById("cancelModal").classList.add("hidden");
}

function submitCancel() {
  const phone = document.getElementById("cancelPhone").value.trim();
  if (!phone) return alert("Enter phone number");

  let found = false;

  spots.forEach(s => {
    if (s.phone === phone) {
      s.status = "free";
      s.phone = null;
      found = true;
    }
  });

  if (!found) return alert("No reservations found");

  alert("Reservation cancelled");
  renderSpots();
  closeCancelModal();
}




renderSpots();




// Loading screen hide after page load
window.addEventListener("load", () => {
  document.body.classList.remove("loading");
  const overlay = document.getElementById("loadingOverlay");

  setTimeout(() => {
    overlay.style.opacity = "0";
  }, 300);

  setTimeout(() => {
    overlay.style.display = "none";
  }, 900);
});

// Initial state
document.body.classList.add("loading");



// --- Live Clock for Last Update ---
function updateLiveClock() {
  const el = document.getElementById("lastUpdate");
  const now = new Date();

  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();

  // Format with leading zeros
  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;

  el.textContent = `${h}:${m}:${s}`;
}

// run every 1 second
setInterval(updateLiveClock, 1000);

// run immediately on load
updateLiveClock();



fetch('http://<IP_LAP>:5000/generate-otp', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({user_id: 1, spot_id: 2})
})
.then(response => response.json())
.then(data => {
 
    document.getElementById('otpDisplay').innerText = data.otp;
});





