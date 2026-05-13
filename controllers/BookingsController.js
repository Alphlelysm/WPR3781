const Booking = require("../models/Bookings")
const Event = require("../models/Events")

const getAuthenticatedUserId = (req) => {
  return req.user?.id || req.user?._id || req.session?.user?._id || req.body.userId
}

const createBooking = async (req, res) => {
  try {
    const eventId = req.params.eventId || req.body.eventId
    const quantity = Number(req.body.quantity) || 1
    const userId = getAuthenticatedUserId(req)

    if (!userId) {
      return res.status(401).json({ message: "Please login before booking" })
    }

    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" })
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" })
    }

    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        status: "available",
        $expr: {
          $lte: [{ $add: ["$bookedSeats", quantity] }, "$capacity"],
        },
      },
      { $inc: { bookedSeats: quantity } },
      { new: true }
    )

    if (!event) {
      return res.status(400).json({
        message: "Not enough seats available or event not found",
      })
    }

    if (event.bookedSeats >= event.capacity && event.status !== "sold-out") {
      event.status = "sold-out"
      await event.save()
    }

    const createdBooking = await Booking.create({
      user: userId,
      event: eventId,
      quantity,
      totalPrice: event.price * quantity,
    })

    const populatedBooking = await Booking.findById(createdBooking._id)
      .populate("event", "title date venue price category")
      .populate("user", "name email")

    return res.status(201).json(populatedBooking)
  } catch (error) {
    return res.status(400).json({
      message: "Error creating booking",
      error: error.message,
    })
  }
}

const getUserBookings = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req)

    if (!userId) {
      return res.status(401).json({ message: "Please login first" })
    }

    const bookings = await Booking.find({ user: userId })
      .populate("event", "title category date venue price")
      .sort({ createdAt: -1 })

    return res.json(bookings)
  } catch (error) {
    return res.status(500).json({
      message: "Error loading bookings",
      error: error.message,
    })
  }
}

//exports
module.exports = {
  createBooking,
  getUserBookings,
}
