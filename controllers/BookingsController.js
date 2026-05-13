const mongoose = require("mongoose")
const Booking = require("../models/Bookings")
const Event = require("../models/Events")

const getAuthenticatedUserId = (req) => {
  return req.user?.id || req.user?._id || req.session?.user?._id || req.body.userId
}

const createBooking = async (req, res) => {
  const session = await mongoose.startSession()

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

    let createdBooking

    await session.withTransaction(async () => {
      const event = await Event.findOneAndUpdate(
        {
          _id: eventId,
          status: "available",
          $expr: {
            $lte: [{ $add: ["$bookedSeats", quantity] }, "$capacity"],
          },
        },
        [
          {
            $set: {
              bookedSeats: { $add: ["$bookedSeats", quantity] },
              status: {
                $cond: [
                  { $eq: [{ $add: ["$bookedSeats", quantity] }, "$capacity"] },
                  "sold-out",
                  "$status",
                ],
              },
            },
          },
        ],
        { new: true, session }
      )

      if (!event) {
        throw new Error("Not enough seats available or event not found")
      }

      const [booking] = await Booking.create(
        [
          {
            user: userId,
            event: eventId,
            quantity,
            totalPrice: event.price * quantity,
          },
        ],
        { session }
      )

      createdBooking = booking
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
  } finally {
    await session.endSession()
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