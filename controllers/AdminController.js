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
    const dashboardStats = await dashboardService.getdashBoardStats()

    return res.json({
      totalBookings: dashboardStats.totalBookings,
      totalEvents: dashboardStats.totalEvents,
      totalRevenue: dashboardStats.totalRevenue,
      popularEvents: dashboardStats.popularEvents,
      capacityUsage: dashboardStats.capacityUsage,
      capacityStats: dashboardStats.capacityUsage,
      dashboardStats,
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error loading dashboard",
      error: error.message,
    })
  }
}

module.exports = {
  getDashboard,
  getRecentBookings,
}
