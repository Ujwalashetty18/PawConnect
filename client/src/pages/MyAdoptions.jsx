import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyAdoptions.css";
function MyAdoptions() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch adoption requests");
      }

      setRequests(data.requests || []);
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

  if (loading) {
    return (
      <div className="my-adoptions-page">
        <h2>Loading your adoption requests...</h2>
      </div>
    );
  }

  return (
    <div className="my-adoptions-page">
      <button className="back-button" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      <div className="adoptions-header">
        <div className="adoption-icon">❤️</div>

        <h1>My Adoption Requests</h1>

        <p>Track the pets you have requested to adopt.</p>
      </div>

      {message && <div className="adoption-message">{message}</div>}

      {requests.length === 0 ? (
        <div className="empty-adoptions">
          <div className="empty-icon">🐾</div>

          <h2>No Adoption Requests Yet</h2>

          <p>You haven't requested to adopt any pets yet.</p>

          <button onClick={() => navigate("/pets")}>Find a Pet</button>
        </div>
      ) : (
        <div className="adoption-list">
          {requests.map((request) => (
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
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="adoption-card-footer">
                {request.status === "Pending" && (
                  <p>⏳ Your request is waiting for review.</p>
                )}

                {request.status === "Approved" && (
                  <p>🎉 Your adoption request has been approved!</p>
                )}

                {request.status === "Rejected" && (
                  <p>❌ Your adoption request was rejected.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAdoptions;
