const Pet = require("../models/Pet");

// ================= ADD PET =================
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

    // Check required fields
    if (!name || !age || !gender || !breed || !species) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Create pet
    const pet = await Pet.create({
      name,
      age,
      gender,
      breed,
      species,
      color,
      vaccinated,
      description,
      location,
      image: req.file ? `/uploads/${req.file.filename}` : "",

      // Logged-in user becomes the owner
      owner: req.user._id,

      // New listing is available for adoption
      status: "available",
    });

    res.status(201).json({
      success: true,
      message: "Pet Added Successfully",
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

// ================= GET ALL PETS =================
exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find({
      status: { $ne: "adopted" },
    })
      .populate("owner", "name email")
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

// ================= GET SINGLE PET =================
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate(
      "owner",
      "name email",
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

// ================= UPDATE PET =================
exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // Check ownership
    const isOwner = pet.owner.toString() === req.user.id.toString();

    // Check admin
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this pet",
      });
    }

    // Update fields
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

    pet.name = name ?? pet.name;
    pet.age = age ?? pet.age;
    pet.gender = gender ?? pet.gender;
    pet.breed = breed ?? pet.breed;
    pet.species = species ?? pet.species;
    pet.color = color ?? pet.color;
    pet.vaccinated = vaccinated ?? pet.vaccinated;
    pet.description = description ?? pet.description;
    pet.location = location ?? pet.location;

    // Only allow valid status values
    if (status && ["available", "pending", "adopted"].includes(status)) {
      pet.status = status;
    }

    // New image if uploaded
    if (req.file) {
      pet.image = `/uploads/${req.file.filename}`;
    }

    await pet.save();

    res.status(200).json({
      success: true,
      message: "Pet Updated Successfully",
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

// ================= DELETE PET =================
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // Check ownership
    const isOwner = pet.owner.toString() === req.user.id.toString();

    // Check admin
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this pet",
      });
    }

    await Pet.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Pet Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete pet error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
