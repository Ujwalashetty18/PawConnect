import { useNavigate } from "react-router-dom";
import "./Donation.css";
const API_URL = import.meta.env.VITE_API_URL;
function Donation() {
  const navigate = useNavigate();

  const organizations = [
    {
      name: "People For Animals",
      shortName: "PFA",
      location: "India",
      description:
        "Supports animal rescue, rehabilitation, shelters, treatment camps and other animal welfare activities.",
      website: "https://peopleforanimalsindia.org/",
      donateUrl: "https://peopleforanimalsindia.org/donate",
      icon: "🐾",
    },
    {
      name: "Blue Cross of India",
      shortName: "BCI",
      location: "Chennai, India",
      description:
        "Works for animal rescue, treatment, shelter and welfare. Their official donation page supports online donations.",
      website: "https://bluecrossofindia.org/",
      donateUrl: "https://bluecrossofindia.org/Donate.html",
      icon: "❤️",
    },
  ];

  return (
    <div className="donation-page">
      {/* Back */}
      <button className="donation-back" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      {/* Hero */}
      <section className="donation-hero">
        <div className="donation-paw">🐾</div>

        <h1>Support Animal Welfare</h1>

        <p>
          Help real organizations that rescue, treat and care for animals in
          need.
        </p>

        <div className="donation-note">
          <span>🔒</span>

          <div>
            <strong>Donate directly to the organization</strong>
            <p>
              PawConnect does not collect your donation. You will be taken to
              the organization's official website to donate securely.
            </p>
          </div>
        </div>
      </section>

      {/* Organizations */}
      <section className="organizations-section">
        <div className="section-heading">
          <h2>Verified Animal Welfare Organizations</h2>

          <p>
            Choose an organization and support their real-world animal welfare
            work.
          </p>
        </div>

        <div className="organization-grid">
          {organizations.map((organization) => (
            <div className="organization-card" key={organization.name}>
              <div className="organization-top">
                <div className="organization-icon">{organization.icon}</div>

                <span className="verified-badge">✓ Verified</span>
              </div>

              <div className="organization-content">
                <h3>{organization.name}</h3>

                <p className="organization-location">
                  📍 {organization.location}
                </p>

                <p className="organization-description">
                  {organization.description}
                </p>
              </div>

              <div className="organization-actions">
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-button"
                >
                  Visit Website
                </a>

                <a
                  href={organization.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="donate-button"
                >
                  Donate Directly →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <h2>How It Works</h2>

        <div className="how-grid">
          <div className="how-card">
            <div>01</div>
            <h3>Choose</h3>
            <p>Select a real animal welfare organization from PawConnect.</p>
          </div>

          <div className="how-card">
            <div>02</div>
            <h3>Donate</h3>
            <p>
              Use the organization's official donation page to make your
              contribution.
            </p>
          </div>

          <div className="how-card">
            <div>03</div>
            <h3>Make an Impact</h3>
            <p>
              Your support goes directly toward the organization's animal
              welfare work.
            </p>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="donation-footer">
        <div className="footer-paw">🐶 🐱 🐾</div>

        <h2>Every act of kindness matters.</h2>

        <p>
          PawConnect makes it easier to discover real organizations working for
          animals.
        </p>
      </section>
    </div>
  );
}

export default Donation;
