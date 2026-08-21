import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPet.css";

function AddPet() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    breed: "",
    species: "",
    color: "",
    vaccinated: false,
    description: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("age", formData.age);
      data.append("gender", formData.gender);
      data.append("breed", formData.breed);
      data.append("species", formData.species);
      data.append("color", formData.color);
      data.append("vaccinated", formData.vaccinated);
      data.append("description", formData.description);
      data.append("location", formData.location);

      if (image) {
        data.append("image", image);
      }

     const API_URL = import.meta.env.VITE_API_URL;

     const response = await fetch(`${API_URL}/api/pets`, {
       method: "POST",
       headers: {
         Authorization: `Bearer ${token}`,
       },
       body: data,
     });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add pet");
      }

      setMessage("🐾 Your pet has been put up for adoption!");

      setTimeout(() => {
        navigate("/pets");
      }, 1000);
    } catch (error) {
      console.error("Add pet error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="add-pet-page">

    <button
      className="back-home-btn"
      onClick={() => navigate("/home")}
    >
      ← Back to Home
    </button>

    <div className="add-pet-header">
      <h1>Put Your Pet Up for Adoption 🐾</h1>
      <p>Help your pet find a loving and caring new home.</p>
    </div>

    <form
      className="add-pet-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >

      <h2>Pet Information</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Pet Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Pet Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Age *</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            min="0"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>Species *</label>
          <input
            type="text"
            name="species"
            placeholder="Dog / Cat"
            value={formData.species}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Breed *</label>
          <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={formData.breed}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>
      </div>

      <h2>Location</h2>

      <div className="form-group full-width">
        <label>Location *</label>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <h2>Health Information</h2>

      <div className="vaccination-section">
        <label className="vaccination-label">
          <input
            type="checkbox"
            name="vaccinated"
            checked={formData.vaccinated}
            onChange={handleChange}
          />
          My pet is vaccinated
        </label>
      </div>

      <h2>About Your Pet</h2>

      <div className="description-section">
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Tell us about your pet..."
            value={formData.description}
            onChange={handleChange}
            rows="5"
          />
        </div>
      </div>

      <h2>Pet Photo</h2>

      <div className="photo-section">
        <label className="photo-label">
          Upload a photo *
        </label>

        <input
          className="photo-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <p className="photo-help">
          JPG, PNG or WEBP. Maximum size: 5MB.
        </p>
      </div>

      <button
        className="submit-pet-btn"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Putting Pet Up..."
          : "❤️ Put Pet Up for Adoption"}
      </button>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}

    </form>
  </div>
);
  
}

export default AddPet;
