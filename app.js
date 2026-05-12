const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");

app.use("/events", eventRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", enquiryRoutes);