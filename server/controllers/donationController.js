const Donation = require("../models/Donation");

// ================= CREATE DONATION =================
exports.createDonation = async (req, res) => {
  try {
    const { donorName, email, amount, message, paymentMethod } = req.body;

    const donation = await Donation.create({
      donorName,
      email,
      amount,
      message,
      paymentMethod,
      paymentStatus: "Completed",
    });

    res.status(201).json({
      success: true,
      message: "Donation Created Successfully",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL DONATIONS =================
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET DONATION BY ID =================
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
