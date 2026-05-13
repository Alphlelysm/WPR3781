const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema
({
    title:
    {
        type: String,
        required: true
    },
    description: String,
    
    category:
    {
        type: String,
        required: true
    },
    date:{
        type: Date,
        required:true
    },
    venue:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    capacity:{
        type: Number,
        required: true,
        min:1
    },
    bookedSeats:{
        type: Number,
        default:0
    },
    status:{
        type: String,
        enum: ["available","sold-out"],
        default:"available"
    }
},{timestamps:true});

EventSchema.index({
    category:1,
    date:1
});
module.exports = mongoose.models.Event || mongoose.model("Event", EventSchema);
