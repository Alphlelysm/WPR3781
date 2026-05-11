const Booking = require("../Bookings");
const Event = require("../Events");

const getDashboardStats = async () => {

    const totalBookings =
        await Booking.countDocuments();

    const revenue =
        await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalPrice"
                    }
                }
            }
        ]);

    const popularEvents =
        await Booking.aggregate([
            {
                $group: {
                    _id: "$event",
                    ticketsSold: {
                        $sum: "$quantity"
                    }
                }
            },
            {
                $sort: {
                    ticketsSold: -1
                }
            }
        ]);

    const capacityUsage =
        await Event.aggregate([
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
        revenue,
        popularEvents,
        capacityUsage
    };
};

module.exports = {
    getDashboardStats
};