import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🐾 PawConnect</div>

        <div className="nav-links">
          <span onClick={() => navigate("/home")}>Home</span>

          <span onClick={() => navigate("/pets")}>Pets</span>

          <span>Adoption</span>

          <span>Donations</span>

          <span>Appointments</span>

          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate("/add-pet")}>
            ❤️ Put My Pet Up for Adoption
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="home-content">
        <section className="hero">
          <h1>Welcome to PawConnect 🐾</h1>

          <p>
            Connecting people with pets who need love, care and a forever home.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/pets")}>Find a Pet</button>

            <button onClick={() => navigate("/pets")}>Adopt a Pet</button>
          </div>
        </section>

        {/* Features */}
        <section className="features">
          <div className="feature-card" onClick={() => navigate("/pets")}>
            <div>🐶</div>
            <h2>Find Pets</h2>
            <p>Discover pets looking for a loving home.</p>
          </div>

          <div className="feature-card">
            <div>🏡</div>
            <h2>Adoption</h2>
            <p>Give a pet a safe and happy forever home.</p>
          </div>

          <div className="feature-card">
            <div>❤️</div>
            <h2>Donate</h2>
            <p>Support animals that need care and treatment.</p>
          </div>

          <div className="feature-card">
            <div>📅</div>
            <h2>Appointments</h2>
            <p>Book appointments for your pets easily.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
