const Event = require("../models/Events")

const defaultEvents = [
  {
    title: "Tech Corp Annual Conference",
    description: "Corporate conference for technology teams and stakeholders.",
    category: "corporate",
    date: "2026-06-15",
    venue: "CSIR ICC, Pretoria",
    price: 450,
    capacity: 800,
    bookedSeats: 750,
    status: "available",
  },
  {
    title: "Amapiano Winter Fest",
    description: "Large-scale winter music festival.",
    category: "festival",
    date: "2026-07-02",
    venue: "SunBet Arena, Pretoria",
    price: 350,
    capacity: 5000,
    bookedSeats: 4998,
    status: "available",
  },
  {
    title: "Leadership and Agile Workshop",
    description: "Small-group workshop for leadership and agile delivery.",
    category: "workshop",
    date: "2026-05-20",
    venue: "Sandton Convention Centre",
    price: 250,
    capacity: 50,
    bookedSeats: 20,
    status: "available",
  },
  {
    title: "Exclusive VIP Gala",
    description: "Private gala event with limited availability.",
    category: "private",
    date: "2026-08-10",
    venue: "The Saxon Hotel, Johannesburg",
    price: 900,
    capacity: 100,
    bookedSeats: 100,
    status: "sold-out",
  },
]

const ensureDefaultEvents = async () => {
  const eventCount = await Event.countDocuments()

  if (eventCount === 0) {
    await Event.insertMany(defaultEvents)
  }
}

const buildEventFilter = (query) => {
  const { search, keyword, category, date, availability, status } = query
  const filter = {}
  const searchText = search || keyword

  if (searchText) {
    filter.$or = [
      { title: { $regex: searchText, $options: "i" } },
      { venue: { $regex: searchText, $options: "i" } },
      { category: { $regex: searchText, $options: "i" } },
    ]
  }

  if (category && category !== "all") {
    filter.category = category
  }

  if (date) {
    const selectedDate = new Date(date)

    if (!Number.isNaN(selectedDate.getTime())) {
      filter.date = { $gte: selectedDate }
    }
  }

  if (status && status !== "all") {
    filter.status = status
  }

  if (availability === "available") {
    filter.$expr = { $lt: ["$bookedSeats", "$capacity"] }
  }

  return filter
}

const getAllEvents = async (req, res) => {
  try {
    await ensureDefaultEvents()

    const events = await Event.find(buildEventFilter(req.query)).sort({ date: 1 })
    return res.json(events)
  } catch (error) {
    return res.status(500).json({
      message: "Error loading events",
      error: error.message,
    })
  }
}

const searchEvents = getAllEvents

const getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    return res.json(event)
  } catch (error) {
    return res.status(500).json({
      message: "Error loading event",
      error: error.message,
    })
  }
}

const createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      date,
      venue,
      price,
      capacity,
      bookedSeats,
      status,
      description,
    } = req.body

    const event = await Event.create({
      title,
      description,
      category,
      date,
      venue,
      price: Number(price) || 0,
      capacity: Number(capacity),
      bookedSeats: Number(bookedSeats) || 0,
      status: status || "available",
    })

    return res.status(201).json(event)
  } catch (error) {
    return res.status(400).json({
      message: "Error creating event",
      error: error.message,
    })
  }
}

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    return res.json(event)
  } catch (error) {
    return res.status(400).json({
      message: "Error updating event",
      error: error.message,
    })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    return res.json({ message: "Event deleted successfully" })
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting event",
      error: error.message,
    })
  }
}

module.exports = {
  getAllEvents,
  searchEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
}
