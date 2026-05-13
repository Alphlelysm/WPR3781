const Booking = require("../models/Bookings")
const dashboardService = require("../services/dashBoardServices")

const getRecentBookings = async () => {
  return await Booking.find()
    .populate("user", "name email")
    .populate("event", "title date")
    .sort({ createdAt: -1 })
}

const getDashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments()

    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ])

    const totalRevenue = revenueData[0]?.totalRevenue || 0

    const dashboardStats = await dashboardService.getdashBoardStats()

    res.json({
      totalBookings,
      totalRevenue,
      capacityStats: dashboardStats.capacityUsage,
      dashboardStats,
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

module.exports = {
  getDashboard,
  getRecentBookings,
}