import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/pets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setPet(data.pet);
        }
      } catch (error) {
        console.error("Error fetching pet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return <div className="details-message">Loading...</div>;
  }

  if (!pet) {
    return (
      <div className="details-message">
        <h2>Pet not found</h2>
        <button onClick={() => navigate("/pets")}>← Back to Pets</button>
      </div>
    );
  }

  return (
    <div className="pet-details-page">
      <button className="back-button" onClick={() => navigate("/pets")}>
        ← Back to Pets
      </button>

      <div className="pet-details-card">
        {/* IMAGE */}
        <div className="pet-details-image">
          {pet.image ? (
            <img src={`${API_URL}${pet.image}`} alt={pet.name} />
          ) : (
            <span>🐶</span>
          )}
        </div>

        {/* INFORMATION */}
        <div className="pet-details-info">
          <p className="available-label">❤️ Looking for a loving home</p>

          <h1>{pet.name}</h1>

          <h3>{pet.breed}</h3>

          <div className="pet-info-grid">
            <div className="info-item">
              <span>🐕</span>
              <div>
                <small>Species</small>
                <strong>{pet.species}</strong>
              </div>
            </div>

            <div className="info-item">
              <span>♂</span>
              <div>
                <small>Gender</small>
                <strong>{pet.gender}</strong>
              </div>
            </div>

            <div className="info-item">
              <span>🎂</span>
              <div>
                <small>Age</small>
                <strong>{pet.age} years</strong>
              </div>
            </div>

            <div className="info-item">
              <span>📍</span>
              <div>
                <small>Location</small>
                <strong>{pet.location}</strong>
              </div>
            </div>

            <div className="info-item">
              <span>💉</span>
              <div>
                <small>Vaccinated</small>
                <strong>{pet.vaccinated ? "Yes" : "No"}</strong>
              </div>
            </div>

            <div className="info-item">
              <span>🎨</span>
              <div>
                <small>Color</small>
                <strong>{pet.color || "Not specified"}</strong>
              </div>
            </div>
          </div>

          <div className="description-box">
            <h3>About {pet.name}</h3>
            <p>{pet.description}</p>
          </div>

          <button
            className="adopt-button"
            onClick={() => navigate(`/pets/${id}/adopt`)}
          >
            ❤️ Adopt / Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetDetails;
