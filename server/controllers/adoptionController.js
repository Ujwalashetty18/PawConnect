const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");

// ======================================================
// CREATE ADOPTION REQUEST
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

    // Logged-in user
    const applicant = req.user;

    // Find pet
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // Pet must be available
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

    // Check duplicate pending request
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

    // Create request
    const adoptionRequest = await AdoptionRequest.create({
      applicant: req.user._id,
      applicantName: applicant.fullName,
      email: applicant.email,
      phone: phone,

      petId: pet._id,
      petName: pet.name,

      owner: pet.owner,

      address: address,
      reason: reason,

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
// receivedRequests = people requesting MY pets
// sentRequests     = requests I sent for other pets
// ======================================================
exports.getAdoptionRequests = async (req, res) => {
  try {
    let receivedRequests = [];
    let sentRequests = [];

    // ==================================================
    // ADMIN
    // ==================================================
    if (req.user.role === "admin") {
      receivedRequests = await AdoptionRequest.find()
        .populate("applicant", "fullName email phone")
        .populate("owner", "fullName email phone")
        .populate("petId")
        .sort({ createdAt: -1 });

      sentRequests = receivedRequests;
    }

    // ==================================================
    // NORMAL USER
    // ==================================================
    else {
      // -----------------------------------------------
      // REQUESTS RECEIVED FOR MY PETS
      // -----------------------------------------------
      receivedRequests = await AdoptionRequest.find({
        owner: req.user._id,
      })
        .populate("applicant", "fullName email phone")
        .populate("owner", "fullName email phone")
        .populate("petId")
        .sort({ createdAt: -1 });

      // -----------------------------------------------
      // REQUESTS I SENT
      // -----------------------------------------------
      sentRequests = await AdoptionRequest.find({
        applicant: req.user._id,
      })
        .populate("applicant", "fullName email phone")
        .populate("owner", "fullName email phone")
        .populate("petId")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,

      receivedCount: receivedRequests.length,
      sentCount: sentRequests.length,

      receivedRequests,
      sentRequests,
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
// Applicant → can view own request
// Owner     → can view request for own pet
// Admin     → can view everything
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

    const applicantId = request.applicant?._id?.toString();
    const ownerId = request.owner?._id?.toString();
    const currentUserId = req.user._id.toString();

    const isApplicant = applicantId === currentUserId;
    const isOwner = ownerId === currentUserId;
    const isAdmin = req.user.role === "admin";

    if (!isApplicant && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this request",
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
// ONLY:
// Pet Owner OR Admin
//
// can approve/reject
// ======================================================
exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
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

    // ==================================================
    // CHECK OWNER / ADMIN
    // ==================================================

    const isOwner =
      request.owner && request.owner.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Only the pet owner or admin can approve or reject this request",
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
      // Already adopted
      if (pet.status === "adopted") {
        return res.status(400).json({
          success: false,
          message: "This pet has already been adopted",
        });
      }

      // Approve selected request
      request.status = "Approved";
      await request.save();

      // Pet becomes adopted
      pet.status = "adopted";
      await pet.save();

      // Reject all other pending requests
      await AdoptionRequest.updateMany(
        {
          petId: pet._id,
          _id: { $ne: request._id },
          status: "Pending",
        },
        {
          $set: {
            status: "Rejected",
          },
        },
      );
    }

    // ==================================================
    // REJECT
    // ==================================================
    else if (status === "Rejected") {
      request.status = "Rejected";
      await request.save();
    }

    // ==================================================
    // PENDING
    // ==================================================
    else {
      request.status = "Pending";
      await request.save();
    }

    // Get updated request
    const updatedRequest = await AdoptionRequest.findById(request._id)
      .populate("applicant", "fullName email phone")
      .populate("owner", "fullName email phone")
      .populate("petId");

    // ==================================================
    // RESPONSE
    // ==================================================

    let message = "Adoption request updated successfully";

    if (status === "Approved") {
      message =
        "Adoption request approved successfully. The applicant can now be contacted.";
    }

    if (status === "Rejected") {
      message = "Adoption request rejected successfully.";
    }

    res.status(200).json({
      success: true,
      message,
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
