const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");

// ======================================================
// CREATE ADOPTION REQUEST
// Any logged-in user can request an available pet
// ======================================================
exports.createAdoptionRequest = async (req, res) => {
  try {
    const { petId, phone, address, reason } = req.body;

    // Check required fields
    if (!petId || !phone || !address || !reason) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Get logged-in user
    const applicant = req.user;

    // Find pet
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // Cannot request an already adopted pet
    if (pet.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "This pet is no longer available for adoption",
      });
    }

    // Owner cannot request their own pet
    if (pet.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot request adoption of your own pet",
      });
    }

    // Check whether this user already has a pending request
    const existingRequest = await AdoptionRequest.findOne({
      applicant: req.user._id,
      petId: pet._id,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this pet",
      });
    }

    // Create adoption request
    const adoptionRequest = await AdoptionRequest.create({
      applicant: req.user._id,

      applicantName: applicant.fullName,

      email: applicant.email,

      phone,

      petId: pet._id,

      petName: pet.name,

      owner: pet.owner,

      address,

      reason,

      status: "Pending",
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

// ======================================================
// GET ADOPTION REQUESTS
//
// Normal user:
// → sees requests for pets THEY OWN
//
// Admin:
// → sees all requests
// ======================================================
exports.getAdoptionRequests = async (req, res) => {
  try {
    let requests;

    if (req.user.role === "admin") {
      // Admin can see everything
      requests = await AdoptionRequest.find()
        .populate("applicant", "fullName email phone")
        .populate("owner", "fullName email phone")
        .populate("petId")
        .sort({ createdAt: -1 });
    } else {
      // Normal user sees requests for their own pets
      requests = await AdoptionRequest.find({
        owner: req.user._id,
      })
        .populate("applicant", "fullName email phone")
        .populate("owner", "fullName email phone")
        .populate("petId")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get adoption requests error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SINGLE ADOPTION REQUEST
//
// Owner of the pet OR admin can view it
// ======================================================
exports.getAdoptionRequestById = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id)
      .populate("applicant", "fullName email phone")
      .populate("owner", "fullName email phone")
      .populate("petId");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Adoption request not found",
      });
    }

    // Check permission
    const isOwner =
      request.owner && request.owner.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the pet owner or admin can update this request",
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get adoption request error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE ADOPTION STATUS
//
// Pet owner OR admin can approve/reject
// ======================================================
exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Find request
    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Adoption request not found",
      });
    }

    // Check owner/admin permission
    // Check owner/admin permission
    const isOwner =
      request.owner && request.owner.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the pet owner or admin can update this request",
      });
    }

    // Find pet
    const pet = await Pet.findById(request.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // ==================================================
    // APPROVE
    // ==================================================
    if (status === "Approved") {
      // Pet must still be available
      if (pet.status === "adopted") {
        return res.status(400).json({
          success: false,
          message: "This pet has already been adopted",
        });
      }

      // Approve this request
      request.status = "Approved";
      await request.save();

      // Pet is now adopted
      pet.status = "adopted";
      await pet.save();

      // Reject all other pending requests for this pet
      await AdoptionRequest.updateMany(
        {
          petId: pet._id,
          _id: { $ne: request._id },
          status: "Pending",
        },
        {
          status: "Rejected",
        },
      );
    } else {
      // ==================================================
      // REJECT / PENDING
      // ==================================================
      request.status = status;
      await request.save();
    }

    const updatedRequest = await AdoptionRequest.findById(request._id)
      .populate("applicant", "fullName email phone")
      .populate("owner", "fullName email phone")
      .populate("petId");

    res.status(200).json({
      success: true,
      message: `Adoption request ${status}`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update adoption status error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};