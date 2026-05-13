const Event = require("../models/Events");


// Create event
const createEvent = async (req, res) =>
 { 
    try 
    { 
        await Event.create(req.body); 
        res.redirect("/events"); 
    } 
    catch (error) 
    { 
        res.status(500) .send(error.message); 
    } 
};



// Get all events
const getEvents = async (req, res) => {

    try {

        const events =
            await Event.find();

        res.render(
            "events/index",
            { events }
        );

    } catch (error) {

        res.status(500)
            .send(error.message);

    }

};

// Delete event
const deleteEvent = async (req, res) => {

    try {

        await Event.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/events");

    } catch (error) {

        res.status(500)
            .send(error.message);

    }

};

const updateEvent = async (req, res) => 
{

        try 
        {

            const eventId =  req.params.id;

            const updatedEvent = await Event.findByIdAndUpdate
            (

                eventId, req.body,
                {
                    new: true,
                    runValidators: true
                }

            );


            if (!updatedEvent) 
            {

                return res
                    .status(404)
                    .send
                    (
                        "Event not found"
                    );

            }


            res.redirect(
                "/events"
            );

        } 
        catch (error) 
        {

            res.status(500)
                .send
                (
                    error.message
                );

        }      

};



module.exports = {
    createEvent,
    getEvents,
     updateEvent,
    deleteEvent
};
