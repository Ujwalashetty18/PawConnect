import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AdoptionRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    address: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/adoptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicantName: formData.applicantName,
          email: formData.email,
          phone: formData.phone,
          petId: id,
          address: formData.address,
          reason: formData.reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to submit adoption request");
        return;
      }

      if (data.success) {
        alert("Adoption request sent successfully! ❤️");

        navigate(`/pets/${id}`);
      }
    } catch (error) {
      console.error("Adoption request error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adoption-page">
      <button className="back-button" onClick={() => navigate(`/pets/${id}`)}>
        ← Back to Pet
      </button>

      <div className="adoption-card">
        <div className="adoption-header">
          <span>❤️</span>

          <h1>Adopt a Pet</h1>

          <p>Tell us a little about yourself.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="form-group">
            <label>Your Name</label>

            <input
              type="text"
              name="applicantName"
              placeholder="Enter your name"
              value={formData.applicantName}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* ADDRESS */}
          <div className="form-group">
            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          {/* REASON */}
          <div className="form-group">
            <label>Why do you want to adopt?</label>

            <textarea
              name="reason"
              placeholder="Tell us why you would like to adopt this pet..."
              value={formData.reason}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          {/* SUBMIT */}
          <button type="submit" className="submit-adoption" disabled={loading}>
            {loading ? "Submitting..." : "❤️ Send Adoption Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdoptionRequest;
