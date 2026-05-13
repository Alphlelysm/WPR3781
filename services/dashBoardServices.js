const Booking = require("../models/Bookings")
const Event = require("../models/Events")

const getdashBoardStats = async () => {
  const totalBookings = await Booking.countDocuments()
  const totalEvents = await Event.countDocuments()

  const revenueData = await Booking.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ])

  const totalRevenue = revenueData[0]?.totalRevenue || 0

  const popularEvents = await Booking.aggregate([
    {
      $group: {
        _id: "$event",
        ticketsSold: { $sum: "$quantity" },
      },
    },
    { $sort: { ticketsSold: -1 } },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    {
      $unwind: {
        path: "$event",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        eventId: "$_id",
        title: "$event.title",
        ticketsSold: 1,
        _id: 0,
      },
    },
    { $limit: 5 },
  ])

  const capacityUsage = await Event.aggregate([
    {
      $project: {
        title: 1,
        capacity: 1,
        bookedSeats: 1,
        availableSeats: { $subtract: ["$capacity", "$bookedSeats"] },
        usage: {
          $cond: [
            { $gt: ["$capacity", 0] },
            {
              $multiply: [
                { $divide: ["$bookedSeats", "$capacity"] },
                100,
              ],
            },
            0,
          ],
        },
        usagePercentage: {
          $cond: [
            { $gt: ["$capacity", 0] },
            {
              $multiply: [
                { $divide: ["$bookedSeats", "$capacity"] },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
    { $sort: { usage: -1 } },
  ])

  return {
    totalEvents,
    totalBookings,
    totalRevenue,
    popularEvents,
    capacityUsage,
  }
}

const getCapacityStats = async () => {
  const stats = await getdashBoardStats()
  return stats.capacityUsage
}

module.exports = {
  getdashBoardStats,
  getCapacityStats,
}
