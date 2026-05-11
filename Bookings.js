const Mongoose = require("mongoose");

const BookingSchema = new Mongoose.Schema
({

    User: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    Event: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    Quantity: 
    {
        type: Number,
        required: true,
        min: 1
    },

    totalPrice: 
    {
        type: Number,
        required: true
    },

    Status: 
    {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    }

}, { timestamps: true });

BookingSchema.index
({
    user: 1,
    event: 1
});

module.exports = mongoose.model("Booking", BookingSchema);