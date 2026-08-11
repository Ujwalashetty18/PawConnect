const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
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
    },

    vaccinated: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
    },

    location: {
      type: String,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Pet", petSchema);
