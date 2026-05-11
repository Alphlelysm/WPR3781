const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "Views/public")));

// Routes
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/admin", require("./routes/AdminRoutes"));
app.use("/api/events", require("./routes/EventRoutes"));
app.use("/api/bookings", require("./routes/BookingRoutes"));
app.use("/api/enquiry", require("./routes/EnquiryRoutes"));


// ✅ ENTRY POINT (LOGIN PAGE)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Views/public/login.html"));
});


// MongoDB
mongoose.connect("mongodb://localhost:27017/WPR3781")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});