// AUTH: REGISTER
// =====================
document.addEventListener("DOMContentLoaded", () => {

    const regForm = document.getElementById("regForm");

    if (!regForm) return;

    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();

      const name = document.getElementById("regFullName").value;
const email = document.getElementById("regEmail").value;
const idNumber = document.getElementById("regIdNumber").value;
const phone = document.getElementById("regPhone").value;
const password = document.getElementById("regPass").value;

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                name,
                email,
                idNumber,
                phone,
                password
        })
            });

            const data = await res.text();
            console.log("REGISTER RESPONSE:", data);

            alert("Account created! Please login.");

            window.location.href = "/login";

        } catch (err) {
            console.log("REGISTER ERROR:", err);
        }
    });

});


// AUTH: LOGIN (JWT)
// =====================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPass").value;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const contentType = res.headers.get("content-type") || "";
            const data = contentType.includes("application/json")
                ? await res.json()
                : { message: await res.text() };

            if (!res.ok) {
                document.getElementById("loginMsg").innerText = data.message || "Login failed";
                return;
            }

            localStorage.setItem("token", data.token);

            window.location.href = "/dashboard.html";

        } catch (err) {
            document.getElementById("loginMsg").innerText = "Unable to log in. Please try again.";
        }
    });
}


// NAVBAR
// =====================
function updateNavbar() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    const token = localStorage.getItem("token");

    if (token) {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="#" id="logoutBtn">Logout</a></li>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });

    } else {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="login.html">Login/Register</a></li>
            <li><a href="contact.html">Contact</a></li>
        `;
    }
}

updateNavbar();

// DASHBOARD SECURITY
// =====================
if (["/dashboard", "/dashboard.html"].includes(window.location.pathname)) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }

    document.getElementById("welcomeText").innerText = "Dashboard";

    const userSection = document.getElementById("userSection");
    const ticketList = document.getElementById("myTicketsList");

    if (userSection && ticketList) {
        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

        userSection.classList.remove("hidden");
        ticketList.innerHTML = bookings.length
            ? bookings.map((booking) => `
                <div class="card">
                    <h3>${booking.name}</h3>
                    <p>Date: ${booking.date}</p>
                    <p>Tickets: ${booking.quantity}</p>
                </div>
            `).join("")
            : "<p>No bookings yet.</p>";
    }
}


// =====================
// EVENTS 
// =====================
if (!localStorage.getItem("events")) {
    const defaultEvents = [
        { id: 1, name: "Tech Corp Annual Conference", date: "2026-06-15", venue: "CSIR ICC, Pretoria", cap: 800, booked: 750, cat: "corporate" },
        { id: 2, name: "Amapiano Winter Fest", date: "2026-07-02", venue: "SunBet Arena, Pretoria", cap: 5000, booked: 4998, cat: "festival" },
        { id: 3, name: "Leadership & Agile Workshop", date: "2026-05-20", venue: "Sandton Convention Centre", cap: 50, booked: 20, cat: "workshop" },
        { id: 4, name: "Exclusive VIP Gala", date: "2026-08-10", venue: "The Saxon Hotel, JHB", cap: 100, booked: 100, cat: "private" }
    ];

    localStorage.setItem("events", JSON.stringify(defaultEvents));
}

if (!localStorage.getItem("bookings")) localStorage.setItem("bookings", JSON.stringify([]));
if (!localStorage.getItem("enquiries")) localStorage.setItem("enquiries", JSON.stringify([]));


// HOME PAGE EVENTS
// =====================
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {

    function loadEvents(filterText = "", category = "all") {
        const events = JSON.parse(localStorage.getItem("events"));
        const grid = document.getElementById("eventGrid");

        if (!grid) return;

        grid.innerHTML = "";

        events.forEach(ev => {
            if (category !== "all" && ev.cat !== category) return;
            if (filterText && !ev.name.toLowerCase().includes(filterText.toLowerCase())) return;

            const ticketsLeft = ev.cap - ev.booked;

            grid.innerHTML += `
                <div class="card">
                    <h3>${ev.name}</h3>
                    <p>📅 ${ev.date}</p>
                    <p>📍 ${ev.venue}</p>
                    <p>🎟️ ${ticketsLeft > 0 ? ticketsLeft + " tickets left" : "<strong style='color:red;'>SOLD OUT</strong>"}</p>
                    <button onclick="window.location.href='event.html?id=${ev.id}'">View Details</button>
                </div>
            `;
        });
    }

    loadEvents();

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const text = document.getElementById("searchInput").value;
            const cat = document.getElementById("categoryFilter").value;
            loadEvents(text, cat);
        });
    }
}

// EVENT DETAILS + BOOKING
// =====================
if (window.location.pathname.includes("event.html")) {
    const params = new URLSearchParams(window.location.search);
    const eventId = Number(params.get("id"));
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const event = events.find((ev) => ev.id === eventId);

    const title = document.getElementById("evTitle");
    const date = document.getElementById("evDate");
    const venue = document.getElementById("evVenue");
    const tickets = document.getElementById("evTickets");
    const bookButton = document.getElementById("bookBtn");
    const message = document.getElementById("bookMsg");

    if (event && title && date && venue && tickets) {
        const available = event.cap - event.booked;

        title.innerText = event.name;
        date.innerText = `Date: ${event.date}`;
        venue.innerText = `Venue: ${event.venue}`;
        tickets.innerText = available > 0 ? `${available} tickets available` : "Sold out";
    }

    if (bookButton) {
        bookButton.addEventListener("click", () => {
            const token = localStorage.getItem("token");

            if (!token) {
                window.location.href = "login.html";
                return;
            }

            if (!event) {
                message.innerText = "Event not found";
                return;
            }

            const quantity = Number(document.getElementById("ticketQty").value);
            const available = event.cap - event.booked;

            if (quantity < 1 || quantity > available) {
                message.innerText = "Not enough tickets available";
                return;
            }

            event.booked += quantity;
            localStorage.setItem("events", JSON.stringify(events));

            const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
            bookings.push({
                eventId: event.id,
                name: event.name,
                quantity,
                date: event.date
            });
            localStorage.setItem("bookings", JSON.stringify(bookings));

            window.location.href = "dashboard.html";
        });
    }
}

// CONTACT ENQUIRIES
// =====================
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const enquiries = JSON.parse(localStorage.getItem("enquiries") || "[]");
        enquiries.push({
            name: document.getElementById("cName").value,
            email: document.getElementById("cEmail").value,
            message: document.getElementById("cMsg").value
        });
        localStorage.setItem("enquiries", JSON.stringify(enquiries));

        const success = document.getElementById("contactSuccess");
        if (success) {
            success.classList.remove("hidden");
        }

        contactForm.reset();
    });
}
