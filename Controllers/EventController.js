const Event = require("../Events");


// Create event
const createEvent = async (req, res) => {

    try {

        await Event.create(req.body);

        res.redirect("/events");

    } catch (error) {

        res.status(500)
            .send(error.message);

    }

};



// Get all events
const getEvents = async (req, res) => {

    const events =
        await Event.find();

    res.render("events/index", {
        events
    });

};



// Delete event
const deleteEvent = async (req, res) => {

    await Event.findByIdAndDelete(
        req.params.id
    );

    res.redirect("/events");

};


module.exports = {
    createEvent,
    getEvents,
    deleteEvent
};