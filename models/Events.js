const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema
({
    Title:
    {
        type: String,
        required: true
    },
    Description: String,
    
    Category:
    {
        type: String,
        required: true
    },
    Date:{
        type: Date,
        required:true
    },
    Vanue:{
        type: String,
        required: true
    },
    Price:{
        type: Number,
        required: true,
        min: 0
    },
    Capacity:{
        type: Number,
        required: true,
        min:1
    },
    BookedSeats:{
        type: Number,
        default:0
    },
    Status:{
        type: String,
        enum: ["available","sold-out"],
        default:"available"
    }
},{timestamps:true});

EventSchema.index({
    Category:1,
    Date:1
});
module.exports = mongoose.models.Event || mongoose.model("Event", EventSchema);