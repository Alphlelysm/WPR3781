const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    totalPrice: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    }

}, { timestamps: true });

// correct index (must match schema fields exactly)
BookingSchema.index({
    user: 1,
    event: 1
});

module.exports = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);