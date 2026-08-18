const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");

// ================= CREATE ADOPTION REQUEST =================
exports.createAdoptionRequest = async (req, res) => {
  try {
    const { applicantName, email, phone, petId, address, reason } = req.body;

    // Check required fields
    if (!applicantName || !email || !phone || !petId || !address || !reason) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check whether pet exists
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // Create adoption request
    const adoptionRequest = await AdoptionRequest.create({
      applicantName,
      email,
      phone,
      petId: pet._id,
      petName: pet.name,
      address,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Adoption request submitted successfully",
      adoptionRequest,
    });
  } catch (error) {
    console.error("Create adoption request error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL ADOPTION REQUESTS =================
exports.getAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find()
      .populate("petId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE REQUEST =================
exports.getAdoptionRequestById = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id).populate(
      "petId",
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Adoption request not found",
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE STATUS =================
exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Adoption request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Adoption request ${status}`,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
