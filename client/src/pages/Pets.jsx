import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pets.css";

const API_URL = import.meta.env.VITE_API_URL;
function Pets() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("All");
  const [gender, setGender] = useState("All");
  const [vaccinated, setVaccinated] = useState("All");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/pets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch pets");
      }

      setPets(data.success ? data.pets || [] : []);
    } catch (err) {
      console.error("Fetch pets error:", err);
      setError(err.message || "Unable to load pets.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSpecies("All");
    setGender("All");
    setVaccinated("All");
    setLocation("");
  };

  const isPetVaccinated = (pet) =>
    pet.vaccinated === true ||
    pet.isVaccinated === true ||
    String(pet.vaccinated).toLowerCase() === "yes";

  const filteredPets = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();

    return pets.filter((pet) => {
      const matchesSearch =
        !searchText ||
        String(pet.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(pet.breed || "")
          .toLowerCase()
          .includes(searchText) ||
        String(pet.species || "")
          .toLowerCase()
          .includes(searchText);

      const matchesSpecies =
        species === "All" ||
        String(pet.species || "").toLowerCase() === species.toLowerCase();

      const matchesGender =
        gender === "All" ||
        String(pet.gender || "").toLowerCase() === gender.toLowerCase();

      const vaccinatedStatus = isPetVaccinated(pet);

      const matchesVaccinated =
        vaccinated === "All" ||
        (vaccinated === "Yes" && vaccinatedStatus) ||
        (vaccinated === "No" && !vaccinatedStatus);

      const matchesLocation =
        !locationText ||
        String(pet.location || "")
          .toLowerCase()
          .includes(locationText);

      return (
        matchesSearch &&
        matchesSpecies &&
        matchesGender &&
        matchesVaccinated &&
        matchesLocation
      );
    });
  }, [pets, search, species, gender, vaccinated, location]);

  if (loading) {
    return (
      <div className="pets-page">
        <button
          type="button"
          className="pets-home-button"
          onClick={() => navigate("/home")}
        >
          <span>←</span>
          Home
        </button>

        <div className="pets-loading">
          <div className="loading-paw">🐾</div>
          <h2>Finding your furry friends...</h2>
          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pets-page">
        <button
          type="button"
          className="pets-home-button"
          onClick={() => navigate("/home")}
        >
          <span>←</span>
          Home
        </button>

        <div className="pets-error">
          <div className="error-icon">🐾</div>
          <h2>Unable to load pets</h2>
          <p>{error}</p>

          <button type="button" onClick={fetchPets}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pets-page">
      {/* ==================================================
          HOME BUTTON
      ================================================== */}
      <button
        type="button"
        className="pets-home-button"
        onClick={() => navigate("/home")}
      >
        <span>←</span>
        Home
      </button>

      {/* ==================================================
          HEADER
      ================================================== */}
      <header className="pets-header">
        <div className="pets-header-paws">🐾</div>

        <h1>Find Your New Best Friend</h1>

        <div className="pets-title-line"></div>

        <p>Discover loving pets looking for their forever home.</p>
      </header>

      {/* ==================================================
          SEARCH + FILTERS
      ================================================== */}
      <section className="pets-filter-box">
        <div className="pets-search">
          <span>🔍</span>

          <input
            type="text"
            value={search}
            placeholder="Search by pet name, breed or species..."
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="pets-filters">
          <div className="filter-group">
            <label>Species</label>

            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              <option value="All">All Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Gender</label>

            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Vaccination</label>

            <select
              value={vaccinated}
              onChange={(e) => setVaccinated(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Yes">Vaccinated</option>
              <option value="No">Not Vaccinated</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>

            <input
              type="text"
              value={location}
              placeholder="Enter location"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>
      </section>

      {/* ==================================================
          RESULTS
      ================================================== */}
      <section className="available-pets">
        <div className="available-header">
          <div>
            <h2>Available Pets</h2>

            <p>
              {filteredPets.length} {filteredPets.length === 1 ? "pet" : "pets"}{" "}
              available
            </p>
          </div>

          {(search ||
            species !== "All" ||
            gender !== "All" ||
            vaccinated !== "All" ||
            location) && (
            <button
              type="button"
              className="reset-results"
              onClick={clearFilters}
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredPets.length === 0 ? (
          <div className="no-pets">
            <div className="no-pets-icon">🐾</div>

            <h3>No pets found</h3>

            <p>We couldn't find any pets matching your search.</p>

            <button type="button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="pets-grid">
            {filteredPets.map((pet) => {
              const vaccinatedStatus = isPetVaccinated(pet);

              return (
                <article className="pet-card" key={pet._id}>
                  {/* IMAGE */}
                  <div className="pet-image-wrapper">
                    {pet.image ? (
                      <img
                        src={`${API_URL}${pet.image}`}
                        alt={pet.name || "Pet"}
                        className="pet-card-image"
                      />
                    ) : (
                      <div className="pet-image-placeholder">🐶</div>
                    )}

                    <span className="pet-status-badge">
                      <span className="status-dot"></span>
                      Available
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="pet-card-content">
                    <div className="pet-name-row">
                      <h3>{pet.name || "Unnamed Pet"}</h3>

                      {vaccinatedStatus && (
                        <span className="vaccinated-badge">✓ Vaccinated</span>
                      )}
                    </div>

                    <p className="pet-breed">{pet.breed || "Mixed Breed"}</p>

                    <div className="pet-details">
                      <span>
                        {String(pet.gender).toLowerCase() === "female"
                          ? "♀"
                          : "♂"}{" "}
                        {pet.gender || "Unknown"}
                      </span>

                      <span>
                        🎂 {pet.age || 0}{" "}
                        {Number(pet.age) === 1 ? "year" : "years"}
                      </span>
                    </div>

                    {pet.location && (
                      <div className="pet-location">📍 {pet.location}</div>
                    )}

                    <button
                      type="button"
                      className="view-details-button"
                      onClick={() => navigate(`/pets/${pet._id}`)}
                    >
                      <span>View Details</span>
                      <span className="details-arrow">→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Pets;
