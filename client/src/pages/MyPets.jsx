import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPets.css";

function MyPets() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyPets();
  }, []);

  // ======================================================
  // FETCH MY PETS
  // ======================================================
  const fetchMyPets = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/pets/my-pets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("My Pets Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch your pets");
      }

      setPets(data.pets || []);
    } catch (error) {
      console.error("Fetch my pets error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE PET
  // ======================================================
  const handleDeletePet = async (petId, petName, status) => {
    if (status === "adopted") {
      alert("An adopted pet cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${petName}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(petId);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Delete Pet Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete pet");
      }

      // Remove deleted pet immediately from UI
      setPets((currentPets) => currentPets.filter((pet) => pet._id !== petId));

      setMessage("Pet deleted successfully.");
    } catch (error) {
      console.error("Delete pet error:", error);
      setMessage(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ======================================================
  // STATUS CLASS
  // ======================================================
  const getStatusClass = (status) => {
    if (status === "available") {
      return "available";
    }

    if (status === "pending") {
      return "pending";
    }

    if (status === "adopted") {
      return "adopted";
    }

    return "";
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <div className="my-pets-page loading">
        <h2>Loading your pets...</h2>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================
  return (
    <div className="my-pets-page">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      {/* Header */}
      <div className="my-pets-header">
        <span>🐾</span>

        <h1>My Pets</h1>

        <p>Manage the pets you have added to PawConnect.</p>
      </div>

      {/* Message */}
      {message && <div className="my-pets-message">{message}</div>}

      {/* No Pets */}
      {pets.length === 0 ? (
        <div className="empty-pets">
          <div className="empty-icon">🐶</div>

          <h2>No Pets Added Yet</h2>

          <p>You haven't added any pets for adoption yet.</p>

          <button onClick={() => navigate("/add-pet")}>+ Add a Pet</button>
        </div>
      ) : (
        <div className="pets-grid">
          {pets.map((pet) => (
            <div className="pet-card" key={pet._id}>
              {/* Image */}
              {pet.image ? (
                <img
                  src={`http://localhost:5000${pet.image}`}
                  alt={pet.name}
                  className="pet-image"
                />
              ) : (
                <div className="pet-image pet-no-image">🐾</div>
              )}

              {/* Content */}
              <div className="pet-content">
                <div className="pet-title">
                  <h2>{pet.name}</h2>

                  <span className={`pet-status ${getStatusClass(pet.status)}`}>
                    {pet.status}
                  </span>
                </div>

                <p>
                  <strong>Species:</strong> {pet.species}
                </p>

                <p>
                  <strong>Breed:</strong> {pet.breed}
                </p>

                <p>
                  <strong>Age:</strong> {pet.age} years
                </p>

                <p>
                  <strong>Gender:</strong> {pet.gender}
                </p>

                {pet.color && (
                  <p>
                    <strong>Color:</strong> {pet.color}
                  </p>
                )}

                <p>
                  <strong>Vaccinated:</strong> {pet.vaccinated ? "Yes" : "No"}
                </p>

                {pet.location && (
                  <p>
                    <strong>Location:</strong> {pet.location}
                  </p>
                )}

                {pet.description && (
                  <p className="pet-description">{pet.description}</p>
                )}

                {/* DELETE BUTTON */}
                <div className="pet-actions">
                  <button
                    type="button"
                    className="delete-pet-button"
                    disabled={deletingId === pet._id}
                    onClick={() =>
                      handleDeletePet(pet._id, pet.name, pet.status)
                    }
                  >
                    {deletingId === pet._id ? "Deleting..." : "🗑 Delete Pet"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPets;
