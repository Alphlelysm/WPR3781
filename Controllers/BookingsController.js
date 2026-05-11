
const Booking = require("../Bookings");
const Event = require("../Events");


const createBooking = async (req, res) => {

    try {

        const {
            eventId,
            quantity
        } = req.body;


        const userId =
            req.session.user._id;


        // Get event
        const event =
            await Event.findById(
                eventId
            );


        if (!event) {
            return res.status(404)
                .send("Event not found");
        }


        // Available seats
        const availableSeats =
            event.capacity -
            event.bookedSeats;


        // Prevent overbooking
        if (quantity > availableSeats) {

            return res.status(400)
                .send(
                    "Not enough seats"
                );

        }


        // Calculate total
        const totalPrice =
            event.price * quantity;


        // Save booking
        await Booking.create({

            user: userId,

            event: eventId,

            quantity,

            totalPrice

        });


        // Update seats
        event.bookedSeats +=
            Number(quantity);


        await event.save();


        res.redirect("/bookings");

    } catch (error) {

        res.status(500)
            .send(error.message);

    }

};

const popularEvents = await Booking.aggregate([
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
    },

    {
        $lookup: {
            from: "Events",
            localField: "_id",
            foreignField: "_id",
            as: "eventData"
        }
    },

    {
        $unwind: "$eventData"
    },

    {
        $project: {
            _id: 0,
            title: "$eventData.title",
            ticketsSold: 1
        }
    },

    {
        $limit: 5
    }
]);



module.exports = {
    createBooking
};