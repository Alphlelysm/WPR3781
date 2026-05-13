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

const formatDateInput = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 10);
};

const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

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
                            <h3>${escapeHtml(event.title || "Event")}</h3>
                            <p>Date: ${formatDate(event.date)}</p>
                            <p>Venue: ${escapeHtml(event.venue || "Venue not set")}</p>
                            <p>Tickets: ${booking.quantity}</p>
                            <p>Total: R${booking.totalPrice}</p>
                        </div>
                    `;
                }).join("")
                : "<p>No bookings yet.</p>";
        } catch (err) {
            ticketList.innerHTML = `<p class="error">${escapeHtml(err.message)}</p>`;
        }
    };

    const loadAdminDashboard = async () => {
        if (!adminSection) return;

        adminSection.classList.remove("hidden");

        try {
            const [stats, events, enquiries] = await Promise.all([
                apiFetch("/api/admin/dashboard"),
                apiFetch("/api/events"),
                apiFetch("/api/enquiries")
            ]);

            const dashboardStats = stats.dashboardStats || {};
            const totalEvents = document.getElementById("totalEventsStat");
            const totalBookings = document.getElementById("totalBookingsStat");
            const totalRevenue = document.getElementById("totalRevenueStat");
            const popularEventsList = document.getElementById("popularEventsList");
            const capacityUsageList = document.getElementById("capacityUsageList");
            const adminEventsList = document.getElementById("adminEventsList");
            const adminEnquiriesList = document.getElementById("adminEnquiriesList");

            if (totalEvents) totalEvents.innerText = dashboardStats.totalEvents || stats.totalEvents || events.length;
            if (totalBookings) totalBookings.innerText = stats.totalBookings || dashboardStats.totalBookings || 0;
            if (totalRevenue) totalRevenue.innerText = `R${stats.totalRevenue || dashboardStats.totalRevenue || 0}`;

            if (popularEventsList) {
                const popularEvents = dashboardStats.popularEvents || stats.popularEvents || [];
                popularEventsList.innerHTML = popularEvents.length
                    ? popularEvents.map((event) => `
                        <div class="dash-box">
                            <strong>${escapeHtml(event.title || "Untitled event")}</strong>
                            <p style="margin: 6px 0 0 0;">${event.ticketsSold || 0} tickets sold</p>
                        </div>
                    `).join("")
                    : "<p>No ticket sales yet.</p>";
            }

            if (capacityUsageList) {
                const capacityStats = stats.capacityStats || dashboardStats.capacityUsage || stats.capacityUsage || [];
                capacityUsageList.innerHTML = capacityStats.length
                    ? capacityStats.map((event) => `
                        <div class="dash-box">
                            <strong>${escapeHtml(event.title || "Untitled event")}</strong>
                            <p style="margin: 6px 0 0 0;">${event.bookedSeats || 0}/${event.capacity || 0} booked (${Math.round(event.usage || event.usagePercentage || 0)}%)</p>
                        </div>
                    `).join("")
                    : "<p>No capacity data yet.</p>";
            }

            if (adminEventsList) {
                adminEventsList.innerHTML = events.length
                    ? events.map((event) => `
                        <div class="card">
                            <form data-edit-event="${event._id}">
                                <input type="text" name="title" value="${escapeHtml(event.title)}" required>
                                <input type="date" name="date" value="${formatDateInput(event.date)}" required>
                                <input type="text" name="venue" value="${escapeHtml(event.venue)}" required>
                                <input type="number" name="capacity" value="${event.capacity || 1}" min="1" required>
                                <input type="number" name="price" value="${event.price || 0}" min="0" required>
                                <select name="category">
                                    <option value="corporate" ${event.category === "corporate" ? "selected" : ""}>Corporate Conference</option>
                                    <option value="workshop" ${event.category === "workshop" ? "selected" : ""}>Workshop</option>
                                    <option value="festival" ${event.category === "festival" ? "selected" : ""}>Music Festival</option>
                                    <option value="private" ${event.category === "private" ? "selected" : ""}>Private Event</option>
                                </select>
                                <select name="status">
                                    <option value="available" ${event.status === "available" ? "selected" : ""}>Available</option>
                                    <option value="sold-out" ${event.status === "sold-out" ? "selected" : ""}>Sold out</option>
                                </select>
                                <p>${event.bookedSeats || 0}/${event.capacity || 0} booked</p>
                                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                    <button type="submit" style="width:auto;">Update</button>
                                    <button type="button" data-delete-event="${event._id}" style="width:auto;">Delete</button>
                                </div>
                            </form>
                        </div>
                    `).join("")
                    : "<p>No events yet.</p>";

                adminEventsList.querySelectorAll("[data-edit-event]").forEach((form) => {
                    form.addEventListener("submit", async (e) => {
                        e.preventDefault();

                        const formData = new FormData(form);
                        await apiFetch(`/api/events/${form.dataset.editEvent}`, {
                            method: "PATCH",
                            body: JSON.stringify({
                                title: formData.get("title"),
                                date: formData.get("date"),
                                venue: formData.get("venue"),
                                capacity: Number(formData.get("capacity")),
                                price: Number(formData.get("price")),
                                category: formData.get("category"),
                                status: formData.get("status")
                            })
                        });
                        await loadAdminDashboard();
                    });
                });

                adminEventsList.querySelectorAll("[data-delete-event]").forEach((button) => {
                    button.addEventListener("click", async () => {
                        await apiFetch(`/api/events/${button.dataset.deleteEvent}`, {
                            method: "DELETE"
                        });
                        await loadAdminDashboard();
                    });
                });
            }

            if (adminEnquiriesList) {
                adminEnquiriesList.innerHTML = enquiries.length
                    ? enquiries.map((enquiry) => {
                        const user = enquiry.user || {};
                        const userLine = user.name || user.email
                            ? `${escapeHtml(user.name || "User")} ${user.email ? `(${escapeHtml(user.email)})` : ""}`
                            : "Website enquiry";

                        return `
                            <div class="card">
                                <h3>${escapeHtml(enquiry.subject || "Enquiry")}</h3>
                                <p>${userLine}</p>
                                <p>${escapeHtml(enquiry.message)}</p>
                                <p>${enquiry.resolved ? "Resolved" : "Open"} - ${formatDate(enquiry.createdAt)}</p>
                                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                    ${enquiry.resolved ? "" : `<button data-resolve-enquiry="${enquiry._id}" style="width:auto;">Resolve</button>`}
                                    <button data-delete-enquiry="${enquiry._id}" style="width:auto;">Delete</button>
                                </div>
                            </div>
                        `;
                    }).join("")
                    : "<p>No enquiries yet.</p>";

                adminEnquiriesList.querySelectorAll("[data-resolve-enquiry]").forEach((button) => {
                    button.addEventListener("click", async () => {
                        await apiFetch(`/api/enquiries/${button.dataset.resolveEnquiry}/resolve`, {
                            method: "PATCH"
                        });
                        await loadAdminDashboard();
                    });
                });

                adminEnquiriesList.querySelectorAll("[data-delete-enquiry]").forEach((button) => {
                    button.addEventListener("click", async () => {
                        await apiFetch(`/api/enquiries/${button.dataset.deleteEnquiry}`, {
                            method: "DELETE"
                        });
                        await loadAdminDashboard();
                    });
                });
            }
        } catch (err) {
            adminSection.innerHTML += `<p class="error">${escapeHtml(err.message)}</p>`;
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
                            <h3>${escapeHtml(event.title)}</h3>
                            <p>Date: ${formatDate(event.date)}</p>
                            <p>Venue: ${escapeHtml(event.venue)}</p>
                            <p>${ticketsLeft > 0 ? `${ticketsLeft} tickets left` : "<strong style='color:red;'>SOLD OUT</strong>"}</p>
                            <button onclick="window.location.href='/event?id=${event._id}'">View Details</button>
                        </div>
                    `;
                }).join("")
                : "<p>No events found.</p>";
        } catch (err) {
            grid.innerHTML = `<p class="error">${escapeHtml(err.message)}</p>`;
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
