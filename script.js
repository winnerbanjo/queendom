const BOOKINGS_KEY = "queendomBookings";
const WHATSAPP_NUMBER = "2348029870054";
const ADMIN_USERNAME = "queendom";
const ADMIN_PASSWORD = "Queendom2026";
const ADMIN_AUTH_KEY = "queendomAdminAuthed";

const priceGuide = {
  "Swedish Massage|60 mins|Spa": "from ₦25k",
  "Swedish Massage|90 mins|Spa": "from ₦32k",
  "Deep Tissue Massage|60 mins|Spa": "from ₦35k",
  "Deep Tissue Massage|90 mins|Spa": "from ₦45k",
  "Hot Stone Massage|60 mins|Spa": "from ₦35k",
  "Yoni Massage|60 mins|Spa": "from ₦45k",
  "Erotic Massage|60 mins|Spa": "from ₦45k",
  "Nuru Massage|60 mins|Spa": "from ₦60k",
  "Nuru Massage|90 mins|Spa": "from ₦70k",
  "Nuru Exclusive|120 mins|Spa": "₦230k",
  "Swedish Massage|60 mins|Home service": "from ₦40k + transport",
  "Swedish Massage|90 mins|Home service": "from ₦50k + transport",
  "Deep Tissue Massage|60 mins|Home service": "from ₦52k + transport",
  "Deep Tissue Massage|90 mins|Home service": "from ₦67k + transport",
  "Hot Stone Massage|60 mins|Home service": "from ₦50k + transport",
  "Yoni Massage|60 mins|Home service": "from ₦55k + transport",
  "Erotic Massage|60 mins|Home service": "from ₦55k + transport",
  "Nuru Massage|60 mins|Home service": "from ₦80k + transport",
  "Nuru Massage|90 mins|Home service": "from ₦110k + transport",
  "Nuru Exclusive|120 mins|Home service": "₦200k + transport"
};

function getBookings() {
  return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function addFloatingWhatsApp() {
  if (document.querySelector(".whatsapp-float")) return;

  const link = document.createElement("a");
  link.className = "whatsapp-float";
  link.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  link.setAttribute("aria-label", "Chat with Queendom De Original Spa on WhatsApp");
  link.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16.03 4.01A11.9 11.9 0 0 0 5.86 22.1L4 28l6.05-1.79A11.9 11.9 0 1 0 16.03 4Zm0 2.19a9.7 9.7 0 0 1 8.22 14.87 9.7 9.7 0 0 1-12.9 3.06l-.42-.25-3.58 1.06 1.09-3.48-.28-.45A9.7 9.7 0 0 1 16.03 6.2Zm-4.2 4.86c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5s1.09 2.9 1.24 3.1c.15.2 2.1 3.35 5.2 4.57 2.57 1.01 3.1.81 3.66.76.56-.05 1.82-.74 2.08-1.46.26-.72.26-1.34.18-1.46-.08-.13-.28-.2-.59-.36-.31-.15-1.82-.9-2.1-1-.28-.1-.49-.15-.7.16-.2.31-.8 1-.98 1.2-.18.2-.36.23-.67.08-.31-.15-1.3-.48-2.48-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.14-.63.14-.14.31-.36.46-.54.15-.18.2-.31.31-.51.1-.2.05-.38-.03-.54-.08-.15-.69-1.67-.95-2.29-.25-.6-.5-.52-.69-.53h-.59Z"/>
    </svg>`;
  document.body.appendChild(link);
}

function bookingToLines(booking) {
  return [
    "Hello Queendom De Original Spa, I have filled the booking form and I would like to confirm my session.",
    "",
    `Booking ID: ${booking.id}`,
    `Name: ${booking.name}`,
    `Phone/WhatsApp: ${booking.phone}`,
    `Date & Time: ${booking.date}`,
    `Massage Type: ${booking.massage}`,
    `Duration: ${booking.duration}`,
    `Location: ${booking.location}`,
    `Estimated Price: ${booking.estimatedPrice}`,
    `Home Address: ${booking.address}`,
    `Allergies / Health Issues: ${booking.health}`,
    `Preferred Pressure: ${booking.pressure}`,
    `Consent: ${booking.consent}`,
    "",
    "I will send my payment receipt here."
  ];
}

function initBookingForm() {
  const bookingForm = document.querySelector("#bookingForm");
  const paymentPanel = document.querySelector("#paymentPanel");
  const bookingSummary = document.querySelector("#bookingSummary");
  const receiptButton = document.querySelector("#receiptButton");

  if (!bookingForm || !paymentPanel || !bookingSummary || !receiptButton) return;

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(bookingForm);
    const lookupKey = `${data.get("massage")}|${data.get("duration")}|${data.get("location")}`;
    const booking = {
      id: `QDS-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: "Awaiting payment",
      name: data.get("name") || "",
      phone: data.get("phone") || "",
      date: data.get("date") || "",
      massage: data.get("massage") || "",
      duration: data.get("duration") || "",
      location: data.get("location") || "",
      address: data.get("address") || "N/A",
      health: data.get("health") || "None shared",
      pressure: data.get("pressure") || "",
      consent: data.get("consent") || "",
      estimatedPrice: priceGuide[lookupKey] || "Confirm with spa"
    };

    const bookings = getBookings();
    bookings.unshift(booking);
    saveBookings(bookings);

    bookingSummary.innerHTML = `
      <strong>${booking.name}, your booking has been saved.</strong>
      <span>${booking.massage} · ${booking.duration} · ${booking.location}</span>
      <span>Estimated price: ${booking.estimatedPrice}</span>
      <span>Booking ID: ${booking.id}</span>
    `;
    receiptButton.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bookingToLines(booking).join("\n"))}`;
    paymentPanel.classList.add("is-visible");
    paymentPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function initAdmin() {
  const adminList = document.querySelector("#adminList");
  if (!adminList) return;

  const loginPanel = document.querySelector("#adminLogin");
  const adminContent = document.querySelector("#adminContent");
  const loginForm = document.querySelector("#adminLoginForm");
  const loginError = document.querySelector("#loginError");
  const logoutButton = document.querySelector("#logoutAdmin");

  function showAdminContent() {
    if (loginPanel) loginPanel.hidden = true;
    if (adminContent) adminContent.hidden = false;
  }

  function showLogin() {
    if (loginPanel) loginPanel.hidden = false;
    if (adminContent) adminContent.hidden = true;
  }

  if (sessionStorage.getItem(ADMIN_AUTH_KEY) === "true") {
    showAdminContent();
  } else {
    showLogin();
  }

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const username = String(data.get("username") || "").trim();
    const password = String(data.get("password") || "");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      if (loginError) loginError.textContent = "";
      showAdminContent();
    } else if (loginError) {
      loginError.textContent = "Incorrect admin login details.";
    }
  });

  logoutButton?.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    showLogin();
  });

  const bookings = getBookings();
  const total = bookings.length;
  const home = bookings.filter((booking) => booking.location === "Home service").length;
  const spa = bookings.filter((booking) => booking.location === "Spa").length;
  const pending = bookings.filter((booking) => booking.status === "Awaiting payment").length;

  document.querySelector("#totalBookings").textContent = total;
  document.querySelector("#homeBookings").textContent = home;
  document.querySelector("#spaBookings").textContent = spa;
  document.querySelector("#pendingBookings").textContent = pending;

  if (!bookings.length) {
    adminList.innerHTML = `<div class="empty-state"><h3>No bookings yet</h3><p class="muted">When a client completes the booking form on this browser, the booking will appear here.</p></div>`;
  } else {
    adminList.innerHTML = bookings.map((booking) => `
      <article class="booking-record">
        <div>
          <h3>${booking.name || "Unnamed client"} · ${booking.massage}</h3>
          <p class="muted">${new Date(booking.createdAt).toLocaleString()} · ${booking.id}</p>
          <dl>
            <div><dt>Phone</dt><dd>${booking.phone}</dd></div>
            <div><dt>Date</dt><dd>${booking.date || "Not set"}</dd></div>
            <div><dt>Location</dt><dd>${booking.location}</dd></div>
            <div><dt>Duration</dt><dd>${booking.duration}</dd></div>
            <div><dt>Pressure</dt><dd>${booking.pressure}</dd></div>
            <div><dt>Price</dt><dd>${booking.estimatedPrice}</dd></div>
            <div><dt>Address</dt><dd>${booking.address}</dd></div>
            <div><dt>Health notes</dt><dd>${booking.health}</dd></div>
            <div><dt>Consent</dt><dd>Accepted</dd></div>
          </dl>
        </div>
        <span class="record-status">${booking.status}</span>
      </article>
    `).join("");
  }

  document.querySelector("#exportBookings")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(bookings, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "queendom-bookings.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });

  document.querySelector("#clearBookings")?.addEventListener("click", () => {
    if (confirm("Clear all saved bookings on this browser?")) {
      saveBookings([]);
      window.location.reload();
    }
  });
}

addFloatingWhatsApp();
initBookingForm();
initAdmin();
