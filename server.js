require("dotenv").config()
const express = require("express")
const path = require("path")
const connectDB = require("./config/db")

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// ROOT ROUTE
app.get("/", (req, res) => {
  res.render("pages/index")
})

app.get("/index.html", (req, res) => {
  res.render("pages/index")
})

app.get("/register", (req, res) => {
  res.render("pages/register")
})

app.get("/register.html", (req, res) => {
  res.render("pages/register")
})

app.get("/login", (req, res) => {
  res.render("pages/login")
})

app.get("/login.html", (req, res) => {
  res.render("pages/login")
})

app.get("/event.html", (req, res) => {
  res.render("pages/event")
})

app.get("/event", (req, res) => {
  res.render("pages/event")
})

app.get("/dashboard.html", (req, res) => {
  res.render("pages/dashboard")
})

app.get("/dashboard", (req, res) => {
  res.render("pages/dashboard")
})

app.get("/contact.html", (req, res) => {
  res.render("pages/contact")
})

app.get("/contact", (req, res) => {
  res.render("pages/contact")
})

// Static files
app.use(
  express.static(path.join(__dirname, "views", "public"), { index: false }),
)

// API Routes
app.use("/api/auth", require("./routes/AuthRoutes"))
app.use("/api/admin", require("./routes/AdminRoutes"))
app.use("/api/events", require("./routes/EventRoutes"))
app.use("/api/bookings", require("./routes/BookingRoutes"))
app.use("/api/enquiries", require("./routes/EnquiryRoutes"))

// Connect to Database + Start Server
connectDB().then(() => {
  const PORT = 5000
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
