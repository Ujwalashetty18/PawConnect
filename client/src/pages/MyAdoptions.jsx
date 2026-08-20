import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyAdoptions.css";

function MyAdoptions() {
  const navigate = useNavigate();

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/adoptions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("MY REQUESTS API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch adoption requests");
      }

      // IMPORTANT
      // Backend sends these two arrays
      setSentRequests(data.sentRequests || []);
      setReceivedRequests(data.receivedRequests || []);
    } catch (error) {
      console.error("Fetch adoption requests error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "approved";
    if (status === "Rejected") return "rejected";
    return "pending";
  };

  const updateStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/adoptions/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      alert(
        status === "Approved"
          ? "Adoption request approved successfully."
          : "Adoption request rejected successfully.",
      );

      // Refresh both sections
      fetchRequests();
    } catch (error) {
      console.error("Update adoption status error:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="my-adoptions-page">
        <h2>Loading your adoption requests...</h2>
      </div>
    );
  }

  return (
    <div className="my-adoptions-page">
      {/* BACK BUTTON */}
      <button className="back-button" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      {/* HEADER */}
      <div className="adoptions-header">
        <h1>My Requests ❤️</h1>

        <p>Track the adoption requests you have sent and received.</p>
      </div>

      {message && <div className="adoption-message">{message}</div>}

      {/* =====================================================
          REQUESTS I SENT
      ====================================================== */}

      <section className="request-section">
        <div className="request-section-header">
          <div>
            <h2>My Adoption Requests</h2>

            <p>Pets you have requested to adopt.</p>
          </div>

          <span className="request-count">{sentRequests.length}</span>
        </div>

        {sentRequests.length === 0 ? (
          <div className="empty-adoptions">
            <div className="empty-icon">🐾</div>

            <h2>No Adoption Requests Yet</h2>

            <p>You haven't requested to adopt any pets yet.</p>

            <button
              className="find-pet-button"
              onClick={() => navigate("/pets")}
            >
              Find a Pet
            </button>
          </div>
        ) : (
          <div className="adoption-list">
            {sentRequests.map((request) => (
              <div className="adoption-card" key={request._id}>
                <div className="adoption-card-header">
                  <div>
                    <h2>{request.petName}</h2>

                    <span
                      className={`adoption-status ${getStatusClass(
                        request.status,
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="paw-icon">🐾</div>
                </div>

                <div className="adoption-details">
                  <p>
                    <strong>Applicant:</strong> {request.applicantName}
                  </p>

                  <p>
                    <strong>Phone:</strong> {request.phone}
                  </p>

                  <p>
                    <strong>Address:</strong> {request.address}
                  </p>

                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>

                  <p>
                    <strong>Submitted:</strong>{" "}
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div className="adoption-card-footer">
                  {request.status === "Pending" && (
                    <p>⏳ Waiting for the pet owner to review your request.</p>
                  )}

                  {request.status === "Approved" && (
                    <p className="success-message">
                      🎉 Your adoption request has been approved! The pet owner
                      can contact you on your phone number.
                    </p>
                  )}

                  {request.status === "Rejected" && (
                    <p className="reject-message">
                      ❌ Your adoption request was rejected by the pet owner.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          REQUESTS I RECEIVED
      ====================================================== */}

      <section className="request-section received-section">
        <div className="request-section-header">
          <div>
            <h2>Requests for My Pets</h2>

            <p>People who want to adopt the pets you posted.</p>
          </div>

          <span className="request-count">{receivedRequests.length}</span>
        </div>

        {receivedRequests.length === 0 ? (
          <div className="empty-received">
            <div className="empty-icon">🐶</div>

            <h2>No Requests Received</h2>

            <p>Nobody has requested to adopt your pets yet.</p>
          </div>
        ) : (
          <div className="adoption-list">
            {receivedRequests.map((request) => (
              <div className="adoption-card received-card" key={request._id}>
                <div className="adoption-card-header">
                  <div>
                    <h2>{request.petName}</h2>

                    <span
                      className={`adoption-status ${getStatusClass(
                        request.status,
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="paw-icon">🐾</div>
                </div>

                <div className="adoption-details">
                  <p>
                    <strong>Applicant:</strong> {request.applicantName}
                  </p>

                  <p>
                    <strong>Email:</strong> {request.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {request.phone}
                  </p>

                  <p>
                    <strong>Address:</strong> {request.address}
                  </p>

                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>

                  <p>
                    <strong>Submitted:</strong>{" "}
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                {/* OWNER ACTIONS */}

                {request.status === "Pending" && (
                  <div className="request-actions">
                    <button
                      className="approve-button"
                      onClick={() => updateStatus(request._id, "Approved")}
                    >
                      ✓ Accept
                    </button>

                    <button
                      className="reject-button"
                      onClick={() => updateStatus(request._id, "Rejected")}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}

                <div className="adoption-card-footer">
                  {request.status === "Pending" && (
                    <p>
                      ⏳ Review this request and accept or reject the applicant.
                    </p>
                  )}

                  {request.status === "Approved" && (
                    <p className="success-message">
                      🎉 You approved this adoption request. You can contact the
                      applicant using their phone number.
                    </p>
                  )}

                  {request.status === "Rejected" && (
                    <p className="reject-message">
                      ❌ You rejected this adoption request.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyAdoptions;
