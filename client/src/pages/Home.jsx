import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="home-page">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo" onClick={() => goTo("/home")}>
          🐾 PawConnect
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <span onClick={() => goTo("/home")}>Home</span>

          <span onClick={() => goTo("/pets")}>Find Pets</span>

          <span onClick={() => goTo("/my-pets")}>My Pets</span>

          <span onClick={() => goTo("/my-adoptions")}>My Requests</span>

          <span onClick={() => goTo("/donations")}>Donations</span>

          <span onClick={() => goTo("/profile")}>👤 Profile</span>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => goTo("/home")}>🏠 Home</button>

          <button onClick={() => goTo("/pets")}>🐶 Find Pets</button>

          <button onClick={() => goTo("/my-pets")}>🐾 My Pets</button>

          <button onClick={() => goTo("/my-adoptions")}>❤️ My Requests</button>

          <button onClick={() => goTo("/donations")}>💝 Donations</button>

          <button onClick={() => goTo("/profile")}>👤 Profile</button>

          <button className="mobile-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main className="home-content">
        {/* ================= HERO ================= */}
        <section className="hero">
          <h1>Welcome to PawConnect 🐾</h1>

          <p>
            Connecting people with pets who need love, care and a forever home.
          </p>

          <div className="hero-buttons">
            <button onClick={() => goTo("/pets")}>🐶 Find a Pet</button>

            <button onClick={() => goTo("/add-pet")}>
              ❤️ Put My Pet Up for Adoption
            </button>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="features">
          <div className="feature-card" onClick={() => goTo("/pets")}>
            <div className="feature-icon">🐶</div>

            <h2>Find Pets</h2>

            <p>Discover pets looking for a loving and caring home.</p>
          </div>

          <div className="feature-card" onClick={() => goTo("/my-pets")}>
            <div className="feature-icon">🐾</div>

            <h2>My Pets</h2>

            <p>View and manage the pets you have added for adoption.</p>
          </div>

          <div className="feature-card" onClick={() => goTo("/my-adoptions")}>
            <div className="feature-icon">❤️</div>

            <h2>My Adoption Requests</h2>

            <p>Track the pets you have requested to adopt.</p>
          </div>

          <div className="feature-card" onClick={() => goTo("/donations")}>
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
