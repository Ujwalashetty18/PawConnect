import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Pets() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("token");

      // If user is not logged in
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/pets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch pets");
      }

      if (data.success) {
        setPets(data.pets || []);
      } else {
        throw new Error(data.message || "Unable to load pets");
      }
    } catch (error) {
      console.error("Fetch pets error:", error);
      setError(error.message || "Unable to load pets.");
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="pets-page">
        <h2>Loading pets... 🐾</h2>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="pets-page">
        <button onClick={() => navigate("/home")}>← Back to Home</button>

        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="pets-page">
      {/* Back button */}
      <button onClick={() => navigate("/home")}>← Back to Home</button>

      <h1>Find a Pet 🐾</h1>

      {/* No pets */}
      {pets.length === 0 ? (
        <p>No pets available right now.</p>
      ) : (
        <div className="pets-grid">
          {pets.map((pet) => (
            <div className="pet-card" key={pet._id}>
              {/* Pet Image */}
              <div className="pet-image">
                {pet.image ? (
                  <img
                    src={`http://localhost:5000${pet.image}`}
                    alt={pet.name}
                  />
                ) : (
                  <span>🐶</span>
                )}
              </div>

              {/* Pet Information */}
              <h2>{pet.name}</h2>

              <p>{pet.breed}</p>

              <p>
                {pet.gender} • {pet.age} years
              </p>

              {pet.location && <p>📍 {pet.location}</p>}

              {/* View Details */}
              <button onClick={() => navigate(`/pets/${pet._id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Pets;
