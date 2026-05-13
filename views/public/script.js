const getCookieValue = (name) => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
};

const getToken = () => getCookieValue("token");

const getCurrentUser = () => {
    const token = getToken();

    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch (error) {
        return null;
    }
};

const apiFetch = async (url, options = {}) => {
    const headers = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
    };

    const response = await fetch(url, {
        credentials: "same-origin",
        ...options,
        headers
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

    if (!response.ok) {
        throw new Error(data.message || data.error || "Request failed");
    }

    return data;
};

const formatDate = (value) => {
    if (!value) return "Date not set";

    return new Date(value).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
};

const showMessage = (element, message) => {
    if (element) element.innerText = message;
};

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
            await apiFetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    idNumber,
                    phone,
                    password
                })
            });

            alert("Account created! Please login.");
            window.location.href = "/login";
        } catch (err) {
            alert(err.message || "Unable to register. Please try again.");
        }
    });
});

// AUTH: LOGIN
// =====================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPass").value;

        try {
            await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            window.location.href = "/dashboard";
        } catch (err) {
            showMessage(document.getElementById("loginMsg"), err.message || "Login failed");
        }
    });
}

// NAVBAR
// =====================
function updateNavbar() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    if (getToken()) {
        navLinks.innerHTML = `
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="#" id="logoutBtn">Logout</a></li>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            document.cookie = "token=; Max-Age=0; path=/";
            window.location.href = "/login";
        });
    } else {
        navLinks.innerHTML = `
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login/Register</a></li>
            <li><a href="/contact">Contact</a></li>
        `;
    }
}

updateNavbar();

// DASHBOARD
// =====================
if (["/dashboard", "/dashboard.html"].includes(window.location.pathname)) {
    const token = getToken();
    const currentUser = getCurrentUser();

    if (!token) {
        window.location.href = "/login";
    }

    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) welcomeText.innerText = "Dashboard";

    const userSection = document.getElementById("userSection");
    const adminSection = document.getElementById("adminSection");

    const loadUserBookings = async () => {
        const ticketList = document.getElementById("myTicketsList");
        if (!userSection || !ticketList) return;

        userSection.classList.remove("hidden");
        ticketList.innerHTML = "<p>Loading bookings...</p>";

        try {
            const bookings = await apiFetch("/api/bookings/my-bookings");

            ticketList.innerHTML = bookings.length
                ? bookings.map((booking) => {
                    const event = booking.event || {};

                    return `
                        <div class="card">
                            <h3>${event.title || "Event"}</h3>
                            <p>Date: ${formatDate(event.date)}</p>
                            <p>Venue: ${event.venue || "Venue not set"}</p>
                            <p>Tickets: ${booking.quantity}</p>
                            <p>Total: R${booking.totalPrice}</p>
                        </div>
                    `;
                }).join("")
                : "<p>No bookings yet.</p>";
        } catch (err) {
            ticketList.innerHTML = `<p class="error">${err.message}</p>`;
        }
    };

    const loadAdminDashboard = async () => {
        if (!adminSection) return;

        adminSection.classList.remove("hidden");

        try {
            const [stats, events] = await Promise.all([
                apiFetch("/api/admin/dashboard"),
                apiFetch("/api/events")
            ]);

            const totalEvents = document.getElementById("totalEventsStat");
            const totalBookings = document.getElementById("totalBookingsStat");
            const adminEventsList = document.getElementById("adminEventsList");

            if (totalEvents) totalEvents.innerText = stats.dashboardStats?.totalEvents || events.length;
            if (totalBookings) totalBookings.innerText = stats.totalBookings || 0;

            if (adminEventsList) {
                adminEventsList.innerHTML = events.length
                    ? events.map((event) => `
                        <div class="card">
                            <h3>${event.title}</h3>
                            <p>${event.category} - ${formatDate(event.date)}</p>
                            <p>${event.venue}</p>
                            <p>${event.bookedSeats || 0}/${event.capacity} booked</p>
                            <button data-delete-event="${event._id}" style="width:auto;">Delete</button>
                        </div>
                    `).join("")
                    : "<p>No events yet.</p>";

                adminEventsList.querySelectorAll("[data-delete-event]").forEach((button) => {
                    button.addEventListener("click", async () => {
                        await apiFetch(`/api/events/${button.dataset.deleteEvent}`, {
                            method: "DELETE"
                        });
                        await loadAdminDashboard();
                    });
                });
            }
        } catch (err) {
            adminSection.innerHTML += `<p class="error">${err.message}</p>`;
        }
    };

    const createEventForm = document.getElementById("createEventForm");
    if (createEventForm) {
        createEventForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                await apiFetch("/api/events", {
                    method: "POST",
                    body: JSON.stringify({
                        title: document.getElementById("newEvName").value,
                        date: document.getElementById("newEvDate").value,
                        venue: document.getElementById("newEvVenue").value,
                        capacity: document.getElementById("newEvCap").value,
                        category: document.getElementById("newEvCat").value,
                        price: 0,
                        bookedSeats: 0,
                        status: "available"
                    })
                });

                createEventForm.reset();
                await loadAdminDashboard();
            } catch (err) {
                alert(err.message);
            }
        });
    }

    if (currentUser?.role === "admin") {
        loadAdminDashboard();
    } else {
        loadUserBookings();
    }
}

// HOME PAGE EVENTS
// =====================
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    const loadEvents = async () => {
        const grid = document.getElementById("eventGrid");
        if (!grid) return;

        const searchText = document.getElementById("searchInput")?.value || "";
        const category = document.getElementById("categoryFilter")?.value || "all";
        const params = new URLSearchParams();

        if (searchText) params.set("search", searchText);
        if (category !== "all") params.set("category", category);

        grid.innerHTML = "<p>Loading events...</p>";

        try {
            const events = await apiFetch(`/api/events${params.toString() ? `?${params}` : ""}`);

            grid.innerHTML = events.length
                ? events.map((event) => {
                    const ticketsLeft = (event.capacity || 0) - (event.bookedSeats || 0);

                    return `
                        <div class="card">
                            <h3>${event.title}</h3>
                            <p>Date: ${formatDate(event.date)}</p>
                            <p>Venue: ${event.venue}</p>
                            <p>${ticketsLeft > 0 ? `${ticketsLeft} tickets left` : "<strong style='color:red;'>SOLD OUT</strong>"}</p>
                            <button onclick="window.location.href='/event?id=${event._id}'">View Details</button>
                        </div>
                    `;
                }).join("")
                : "<p>No events found.</p>";
        } catch (err) {
            grid.innerHTML = `<p class="error">${err.message}</p>`;
        }
    };

    loadEvents();

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", loadEvents);
    }
}

// EVENT DETAILS + BOOKING
// =====================
if (["/event", "/event.html"].includes(window.location.pathname)) {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    const title = document.getElementById("evTitle");
    const date = document.getElementById("evDate");
    const venue = document.getElementById("evVenue");
    const tickets = document.getElementById("evTickets");
    const bookButton = document.getElementById("bookBtn");
    const message = document.getElementById("bookMsg");

    const loadEventDetails = async () => {
        if (!eventId) {
            showMessage(title, "Event not found");
            return null;
        }

        try {
            const event = await apiFetch(`/api/events/${eventId}`);
            const available = (event.capacity || 0) - (event.bookedSeats || 0);

            showMessage(title, event.title);
            showMessage(date, `Date: ${formatDate(event.date)}`);
            showMessage(venue, `Venue: ${event.venue}`);
            showMessage(tickets, available > 0 ? `${available} tickets available` : "Sold out");

            return event;
        } catch (err) {
            showMessage(title, "Event not found");
            showMessage(message, err.message);
            return null;
        }
    };

    let currentEvent;
    loadEventDetails().then((event) => {
        currentEvent = event;
    });

    if (bookButton) {
        bookButton.addEventListener("click", async () => {
            if (!getToken()) {
                window.location.href = "/login";
                return;
            }

            if (!currentEvent) {
                showMessage(message, "Event not found");
                return;
            }

            const quantity = Number(document.getElementById("ticketQty").value);

            try {
                await apiFetch("/api/bookings", {
                    method: "POST",
                    body: JSON.stringify({
                        eventId: currentEvent._id,
                        quantity
                    })
                });

                window.location.href = "/dashboard";
            } catch (err) {
                showMessage(message, err.message);
                currentEvent = await loadEventDetails();
            }
        });
    }
}

// CONTACT ENQUIRIES
// =====================
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const success = document.getElementById("contactSuccess");

        try {
            await apiFetch("/api/enquiries/submit", {
                method: "POST",
                body: JSON.stringify({
                    name: document.getElementById("cName").value,
                    email: document.getElementById("cEmail").value,
                    message: document.getElementById("cMsg").value
                })
            });

            if (success) {
                success.classList.remove("hidden");
                success.innerText = "Your support ticket has been logged successfully.";
            }

            contactForm.reset();
        } catch (err) {
            if (success) {
                success.classList.remove("hidden");
                success.innerText = err.message;
            }
        }
    });
}
