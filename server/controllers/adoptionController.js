const AdoptionRequest = require("../models/AdoptionRequest");

// ================= CREATE ADOPTION REQUEST =================
exports.createAdoptionRequest = async (req, res) => {
  try {
    const { applicantName, email, phone, petId, petName, address, reason } =
      req.body;

    const request = await AdoptionRequest.create({
      applicantName,
      email,
      phone,
      petId,
      petName,
      address,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Adoption Request Submitted Successfully",
      request,
    });
  } catch (error) {
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

// ================= GET REQUEST BY ID =================
exports.getAdoptionRequestById = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id).populate(
      "petId",
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Adoption Request not found",
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

// ================= UPDATE REQUEST STATUS =================
exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ).populate("petId");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Adoption Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Adoption Request Status Updated Successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE REQUEST =================
exports.deleteAdoptionRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Adoption Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Adoption Request Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
