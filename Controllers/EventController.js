// controllers/eventController.js
const Event = require("../models/Event");

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.render("events/index", { events });
  } catch (error) {
    res.status(500).send("Error loading events");
  }
};

exports.searchEvents = async (req, res) => {
  try {
    const { keyword, category, date, availability } = req.query;

    let filter = {};

    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (date) {
      filter.date = { $gte: new Date(date) };
    }

    if (availability === "available") {
      filter.$expr = { $lt: ["$ticketsSold", "$capacity"] };
    }

    const events = await Event.find(filter).sort({ date: 1 });

    res.render("events/index", { events });
  } catch (error) {
    res.status(500).send("Error searching events");
  }
};

exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).send("Event not found");
    }

    res.render("events/details", { event });
  } catch (error) {
    res.status(500).send("Error loading event details");
  }
};

exports.showCreateEvent = (req, res) => {
  res.render("admin/createEvent");
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, location, capacity, price } = req.body;

    await Event.create({
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,
      ticketsSold: 0
    });

    res.redirect("/admin/events");
  } catch (error) {
    res.status(500).send("Error creating event");
  }
};

exports.showEditEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.render("admin/editEvent", { event });
  } catch (error) {
    res.status(500).send("Error loading event");
  }
};

exports.updateEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/admin/events");
  } catch (error) {
    res.status(500).send("Error updating event");
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect("/admin/events");
  } catch (error) {
    res.status(500).send("Error deleting event");
  }
};