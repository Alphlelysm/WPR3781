const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema
({

    user: 
   {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
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

module.exports = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);