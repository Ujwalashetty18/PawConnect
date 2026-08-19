const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    // User who owns/posted the pet
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    breed: {
      type: String,
      required: true,
    },

    species: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      default: "",
    },

    vaccinated: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    // Adoption status
    status: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Pet", petSchema);
