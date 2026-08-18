import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-page">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/home")}>
          🐾 PawConnect
        </div>

        <div className="nav-links">
          <span onClick={() => navigate("/home")}>Home</span>

          <span onClick={() => navigate("/pets")}>Find Pets</span>

          <span onClick={() => navigate("/my-pets")}>My Pets</span>

          <span onClick={() => navigate("/my-adoptions")}>My Requests</span>

          <span onClick={() => navigate("/donations")}>Donations</span>

          <span onClick={() => navigate("/profile")}>👤 Profile</span>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>

          <button
            className="add-pet-button"
            onClick={() => navigate("/add-pet")}
          >
            ❤️ Put My Pet Up for Adoption
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="home-content">
        {/* ================= HERO ================= */}
        <section className="hero">
          <h1>Welcome to PawConnect 🐾</h1>

          <p>
            Connecting people with pets who need love, care and a forever home.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/pets")}>🐶 Find a Pet</button>

            <button onClick={() => navigate("/add-pet")}>
              ❤️ Put My Pet Up for Adoption
            </button>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="features">
          {/* Find Pets */}
          <div className="feature-card" onClick={() => navigate("/pets")}>
            <div className="feature-icon">🐶</div>

            <h2>Find Pets</h2>

            <p>Discover pets looking for a loving home.</p>
          </div>

          {/* My Pets */}
          <div className="feature-card" onClick={() => navigate("/my-pets")}>
            <div className="feature-icon">🐾</div>

            <h2>My Pets</h2>

            <p>View and manage the pets you have added.</p>
          </div>

          {/* My Adoption Requests */}
          <div
            className="feature-card"
            onClick={() => navigate("/my-adoptions")}
          >
            <div className="feature-icon">❤️</div>

            <h2>My Adoption Requests</h2>

            <p>Track the pets you have requested to adopt.</p>
          </div>

          {/* Donations */}
          <div className="feature-card" onClick={() => navigate("/donations")}>
            <div className="feature-icon">💝</div>

            <h2>Support Animal Welfare</h2>

            <p>Support real organizations helping animals in need.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
