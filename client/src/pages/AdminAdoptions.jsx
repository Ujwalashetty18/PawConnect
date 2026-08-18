import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAdoptions.css";
function AdminAdoptions() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ================= GET ALL REQUESTS =================
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/adoptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error("Fetch adoption requests error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchRequests();
  }, []);

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/adoptions/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? { ...request, status: data.request.status }
            : request,
        ),
      );

      setMessage(`Request ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.error("Update adoption status error:", error);
      setMessage(error.message);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="admin-adoptions-page">
        <h2>Loading adoption requests...</h2>
      </div>
    );
  }

  return (
    <div className="admin-adoptions-page">
      <button className="back-button" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      <div className="admin-adoptions-header">
        <h1>Adoption Requests 🐾</h1>

        <p>Review and manage pet adoption requests.</p>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {requests.length === 0 ? (
        <div className="empty-requests">
          <h2>No Adoption Requests</h2>
          <p>There are currently no adoption requests.</p>
        </div>
      ) : (
        <div className="requests-container">
          {requests.map((request) => (
            <div className="adoption-request-card" key={request._id}>
              <div className="request-header">
                <div>
                  <h2>{request.petName}</h2>

                  <span className={`status ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="request-details">
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
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>

              {request.status === "Pending" && (
                <div className="request-actions">
                  <button
                    className="approve-button"
                    onClick={() => updateStatus(request._id, "Approved")}
                  >
                    ✓ Approve
                  </button>

                  <button
                    className="reject-button"
                    onClick={() => updateStatus(request._id, "Rejected")}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAdoptions;
