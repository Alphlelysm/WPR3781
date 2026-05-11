const Booking = require("../Models/Bookings");
const dashboardService = require("../Services/dashboardServices");

// GET RECENT BOOKINGS
const getRecentBookings = async () => {
    return await Booking.find()
        .populate("user", "name email")
        .populate("event", "title date")
        .sort({ createdAt: -1 });
};

// DASHBOARD
const getDashboard = async (req, res) => {

    try {

        const totalBookings = await Booking.countDocuments();

        const revenueData = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        const capacityStats = await dashboardService.getCapacityStats();

        res.render("admin/dashboard", {
            totalBookings,
            totalRevenue,
            capacityStats
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getDashboard,
    getRecentBookings
};