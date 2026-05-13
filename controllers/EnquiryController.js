const Enquiry = require("../models/Enquiry")

const submitEnquiry = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.session?.user?._id || req.body.userId
    const subject = req.body.subject || `Enquiry from ${req.body.name || "website user"}`
    const message = req.body.message

    if (!message) {
      return res.status(400).json({ message: "Message is required" })
    }

    const enquiry = await Enquiry.create({
      user: userId || undefined,
      subject,
      message,
    })

    return res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry,
    })
  } catch (error) {
    return res.status(400).json({
      message: "Error submitting enquiry",
      error: error.message,
    })
  }
}

const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    return res.json(enquiries)
  } catch (error) {
    return res.status(500).json({
      message: "Error loading enquiries",
      error: error.message,
    })
  }
}

const resolveEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    )

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" })
    }

    return res.json(enquiry)
  } catch (error) {
    return res.status(400).json({
      message: "Error resolving enquiry",
      error: error.message,
    })
  }
}

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id)

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" })
    }

    return res.json({ message: "Enquiry deleted successfully" })
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting enquiry",
      error: error.message,
    })
  }
}

module.exports = {
  submitEnquiry,
  getAllEnquiries,
  resolveEnquiry,
  deleteEnquiry,
}