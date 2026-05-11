const Booking = require("../Bookings");

const getRecentBookings = async () => 
{

    const bookings = await Booking.find()

        .populate("user", "name email")
        .populate("event", "title date")

        .sort({ createdAt: -1 });

    return bookings;
};
const totalBookings = await Booking.countDocuments();

const totalRevenue = await Booking.aggregate
([
    {
        $group: {
            _id: null,

            revenue: 
            {
                $sum: "$totalPrice"
            }
        }
    }
]);

const dashboardService =
    require("../services/dashboardService");


const getDashboard =
    async (req, res) => {

        try {

            const capacityStats =
                await dashboardService
                    .getCapacityStats();


            res.render(
                "admin/dashboard",
                {
                    capacityStats
                }
            );

        } catch (error) {

            res.status(500)
                .send(error.message);

        }

};


module.exports = {
    getDashboard
};