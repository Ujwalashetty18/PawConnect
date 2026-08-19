const Pet = require("../models/Pet");

// ========================================
// ADD PET
// Logged-in user can add their pet
// ========================================
exports.addPet = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      breed,
      species,
      color,
      vaccinated,
      description,
      location,
    } = req.body;

    // Basic validation
    if (!name || !age || !gender || !breed || !species) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required pet details",
      });
    }

    const pet = await Pet.create({
      owner: req.user._id,

      name,
      age,
      gender,
      breed,
      species,
      color: color || "",
      vaccinated: vaccinated === true || vaccinated === "true",
      description: description || "",
      location: location || "",

      image: req.file ? `/uploads/${req.file.filename}` : "",

      status: "available",
    });

    res.status(201).json({
      success: true,
      message: "Pet added successfully",
      pet,
    });
  } catch (error) {
    console.error("Add pet error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET ALL AVAILABLE PETS
// Used by Find Pets
// ========================================
exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find({
      status: "available",
    })
      .populate("owner", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pets.length,
      pets,
    });
  } catch (error) {
    console.error("Get pets error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET MY PETS
// Logged-in user sees only their own pets
// ========================================
exports.getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({
      owner: req.user._id,
    })
      .populate("owner", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pets.length,
      pets,
    });
  } catch (error) {
    console.error("Get my pets error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET SINGLE PET
// ========================================
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate(
      "owner",
      "fullName email phone",
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    res.status(200).json({
      success: true,
      pet,
    });
  } catch (error) {
    console.error("Get pet error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE PET
// Only owner or admin
// ========================================
exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    const isOwner =
      pet.owner && pet.owner.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own pet listing.",
      });
    }

    const {
      name,
      age,
      gender,
      breed,
      species,
      color,
      vaccinated,
      description,
      location,
      status,
    } = req.body;

    if (name !== undefined) pet.name = name;
    if (age !== undefined) pet.age = age;
    if (gender !== undefined) pet.gender = gender;
    if (breed !== undefined) pet.breed = breed;
    if (species !== undefined) pet.species = species;
    if (color !== undefined) pet.color = color;

    if (vaccinated !== undefined) {
      pet.vaccinated = vaccinated === true || vaccinated === "true";
    }

    if (description !== undefined) {
      pet.description = description;
    }

    if (location !== undefined) {
      pet.location = location;
    }

    if (status !== undefined) {
      pet.status = status;
    }

    if (req.file) {
      pet.image = `/uploads/${req.file.filename}`;
    }

    await pet.save();

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      pet,
    });
  } catch (error) {
    console.error("Update pet error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE PET
// Only owner or admin
// ========================================
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    const isOwner =
      pet.owner && pet.owner.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own pet listing.",
      });
    }

    await Pet.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Pet deleted successfully",
    });
  } catch (error) {
    console.error("Delete pet error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
