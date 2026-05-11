const Mongoose = require("mongoose");

const EnquirySchema = new Mongoose.Schema
({

    user: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    subject: 
    {
        type: String,
        required: true
    },

    message: 
    {
        type: String,
        required: true
    },

    resolved: 
    {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = Mongoose.model("Enquiry", EnquirySchema);