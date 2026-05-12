const Booking = require("../Models/Bookings");
const Event = require("../Models/Events");

const getDashboardStats = async () => {

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

    const popularEvents = await Booking.aggregate([
        {
            $group: {
                _id: "$event",
                ticketsSold: { $sum: "$quantity" }
            }
        },
        {
            $sort: { ticketsSold: -1 }
        }
    ]);

    const capacityUsage = await Event.aggregate([
        {
            $project: {
                title: 1,
                usage: {
                    $multiply: [
                        {
                            $divide: [
                                "$bookedSeats",
                                "$capacity"
                            ]
                        },
                        100
                    ]
                }
            }
        }
    ]);

    return {
        totalBookings,
        totalRevenue,
        popularEvents,
        capacityUsage
    };
};

module.exports = {
    getdashBoardStats
};