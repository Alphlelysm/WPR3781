const Enquiry =
    require("../Models/Enquiry");


const submitEnquiry =
    async (req, res) => {

        await Enquiry.create({

            user:
                req.session.user._id,

            subject:
                req.body.subject,

            message:
                req.body.message

        });

        res.redirect("/");

};


module.exports = {
    submitEnquiry
};