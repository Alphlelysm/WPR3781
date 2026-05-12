const Booking = require("../Models/Bookings");
const Event = require("../Models/Events");


// CREATE BOOKING
const createBooking = async (req, res) => {
    try {

        const { eventId, quantity } = req.body;

        const userId = req.session.user._id;

        // Get event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).send("Event not found");
        }

        // Check available seats
        const availableSeats = event.capacity - event.bookedSeats;

        if (quantity > availableSeats) {
            return res.status(400).send("Not enough seats available");
        }

        // Calculate price
        const totalPrice = event.price * quantity;

        // Create booking
        await Booking.create({
            user: userId,
            event: eventId,
            quantity,
            totalPrice
        });

        // Update event seats
        event.bookedSeats += Number(quantity);
        await event.save();

        res.redirect("/bookings");

    } catch (error) {
        res.status(500).send(error.message);
    }
};


// GET TOP 5 POPULAR EVENTS
const getPopularEvents = async (req, res) => {
    try {

        const popularEvents = await Booking.aggregate([
            {
                $group: {
                    _id: "$event",
                    ticketsSold: { $sum: "$quantity" }
                }
            },
            {
                $sort: { ticketsSold: -1 }
            },
            {
                $lookup: {
                    from: "events",
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

        res.json(popularEvents);

    } catch (error) {
        res.status(500).send(error.message);
    }
};


// EXPORT
module.exports = {
    createBooking,
    getPopularEvents
};