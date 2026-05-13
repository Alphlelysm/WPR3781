require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROOT ROUTE
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "views", "public", "login.html");
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending login.html:", err);
            res.status(404).send("Login page not found");
        }
    });
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "public", "register.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "public", "login.html"));
});

// Static files
app.use(express.static(path.join(__dirname, "views", "public"), { index: false }));

// API Routes
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/admin", require("./routes/AdminRoutes"));
// ... other routes

// Connect to Database + Start Server
connectDB().then(() => {
    const PORT = 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
