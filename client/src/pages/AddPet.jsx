import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append("image", image);
      }

      const response = await fetch("http://localhost:5000/api/pets", {
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

      setMessage("🐾 Pet successfully put up for adoption!");

      setTimeout(() => {
        navigate("/pets");
      }, 1000);
    } catch (error) {
      console.error("Add pet error:", error);
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-pet-page">
      <button className="back-button" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      <div className="add-pet-container">
        <div className="add-pet-header">
          <h1>Put Your Pet Up for Adoption 🐾</h1>

          <p>Help your pet find a loving and caring new home.</p>
        </div>

        <form
          className="add-pet-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* BASIC INFORMATION */}

          <div className="form-section">
            <h2>Pet Information</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Pet Name *</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter pet name"
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
                  placeholder="Age in years"
                  min="0"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

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
                  placeholder="Dog, Cat, Rabbit..."
                  value={formData.species}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Breed *</label>

                <input
                  type="text"
                  name="breed"
                  placeholder="Labrador, Persian..."
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
                  placeholder="Brown, Black..."
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* LOCATION */}

          <div className="form-section">
            <h2>Location</h2>

            <div className="form-group">
              <label>Location *</label>

              <input
                type="text"
                name="location"
                placeholder="Mangalore"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* HEALTH */}

          <div className="form-section">
            <h2>Health Information</h2>

            <label className="checkbox-group">
              <input
                type="checkbox"
                name="vaccinated"
                checked={formData.vaccinated}
                onChange={handleChange}
              />

              <span>My pet is vaccinated</span>
            </label>
          </div>

          {/* DESCRIPTION */}

          <div className="form-section">
            <h2>About Your Pet</h2>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Tell potential adopters about your pet..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>
          </div>

          {/* IMAGE */}

          <div className="form-section">
            <h2>Pet Photo</h2>

            <div className="form-group">
              <label>Upload a photo *</label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />

              <small>JPG, PNG or WEBP. Maximum size: 5MB.</small>
            </div>
          </div>

          {/* MESSAGE */}

          {message && <div className="form-message">{message}</div>}

          {/* SUBMIT */}

          <button
            type="submit"
            className="submit-pet-button"
            disabled={loading}
          >
            {loading
              ? "Putting Pet Up for Adoption..."
              : "❤️ Put Pet Up for Adoption"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPet;
