import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // =========================
  // USER STATE
  // =========================
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // EDIT PROFILE
  // =========================
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // =========================
  // PASSWORD
  // =========================
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // =========================
  // SETTINGS
  // =========================
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // =========================
  // MESSAGE
  // =========================
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    fetchUser();
  }, []);

  // =========================
  // DARK MODE
  // =========================
  useEffect(() => {
    const savedTheme = localStorage.getItem("pawconnect-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  // =========================
  // FETCH USER
  // =========================
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      const currentUser = data.user;

      setUser(currentUser);
      setFullName(currentUser.fullName || "");
      setPhone(currentUser.phone || "");

     if (currentUser.profileImage) {

       setImagePreview(`${API_URL}${currentUser.profileImage}`);
     }
    } catch (error) {
      console.error("Profile error:", error);

      setMessage(error.message || "Unable to load profile.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // IMAGE SELECT
  // =========================
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      setMessageType("error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5MB.");
      setMessageType("error");
      return;
    }

    setProfileImage(file);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    setEditing(true);
  };

  // =========================
  // EDIT PROFILE
  // =========================
  const handleEdit = () => {
    setEditing(true);
    setMessage("");
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditing(false);
    setFullName(user?.fullName || "");
    setPhone(user?.phone || "");
    setProfileImage(null);


    if (user?.profileImage) {
      setImagePreview(`${API_URL}${user.profileImage}`);
    } else {
      setImagePreview("");
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!fullName.trim()) {
        setMessage("Full name is required.");
        setMessageType("error");
        return;
      }

      const formData = new FormData();

      formData.append("fullName", fullName.trim());
      formData.append("phone", phone.trim());

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }


      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);

      setFullName(data.user.fullName || "");
      setPhone(data.user.phone || "");

      

      if (data.user.profileImage) {
        setImagePreview(`${API_URL}${data.user.profileImage}`);
      }

      setProfileImage(null);
      setEditing(false);

      setMessage("Profile updated successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Update profile error:", error);

      setMessage(error.message || "Unable to update profile.");
      setMessageType("error");
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword) {
        setMessage("Please enter both passwords.");
        setMessageType("error");
        return;
      }

      if (newPassword.length < 6) {
        setMessage("New password must be at least 6 characters.");
        setMessageType("error");
        return;
      }

      const token = localStorage.getItem("token");

      

      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordSection(false);

      setMessage("Password changed successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Password error:", error);

      setMessage(error.message || "Unable to change password.");
      setMessageType("error");
    }
  };

  // =========================
  // NOTIFICATIONS
  // =========================
  const handleNotificationToggle = () => {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem("pawconnect-notifications", String(newValue));
  };

  // =========================
  // APPEARANCE
  // =========================
  const handleAppearanceToggle = () => {
    const newValue = !darkMode;

    setDarkMode(newValue);

    if (newValue) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("pawconnect-theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("pawconnect-theme", "light");
    }
  };

  // =========================
  // DELETE ACCOUNT
  // =========================
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

     

     const response = await fetch(`${API_URL}/api/auth/delete-account`, {
       method: "DELETE",
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      localStorage.removeItem("token");

      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error);

      setMessage(error.message || "Unable to delete account.");
      setMessageType("error");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  // =========================
  // NO USER
  // =========================
  if (!user) {
    return (
      <div className="profile-error">
        <h2>Unable to load profile</h2>

        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  // =========================
  // PROFILE IMAGE
  // =========================
  const getInitial = () => {
    if (user.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }

    return "U";
  };

  return (
    <div className="profile-page">
      {/* ================= NAVBAR ================= */}
      <nav className="profile-navbar">
        <div className="profile-left">
          <div className="profile-logo" onClick={() => navigate("/home")}>
            🐾 PawConnect
          </div>

          <button
            type="button"
            className="profile-home-button"
            onClick={() => navigate("/home")}
          >
            ← Home
          </button>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="profile-container">
        {/* ================= PROFILE HEADER ================= */}
        <section className="profile-header">
          <div className="profile-avatar-wrapper">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar">{getInitial()}</div>
            )}

            <button
              className="camera-button"
              onClick={() => fileInputRef.current?.click()}
              title="Change profile picture"
            >
              📷
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </div>

          <div className="profile-header-info">
            <h1>{user.fullName}</h1>

            <p>Manage your PawConnect account</p>
          </div>
        </section>

        {/* ================= MESSAGE ================= */}
        {message && (
          <div
            className={`profile-message ${
              messageType === "success" ? "success-message" : "error-message"
            }`}
          >
            {message}
          </div>
        )}

        {/* ================= PERSONAL INFORMATION ================= */}
        <section className="profile-card">
          <div className="card-header">
            <div>
              <h2>👤 Personal Information</h2>

              <p>View and manage your personal information</p>
            </div>

            {!editing && (
              <button className="primary-button" onClick={handleEdit}>
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="edit-profile-form">
              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input type="email" value={user.email} disabled />

                <small>Email cannot be changed here.</small>
              </div>

              <div className="edit-buttons">
                <button className="primary-button" onClick={handleSaveProfile}>
                  ✓ Save Changes
                </button>

                <button className="secondary-button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="information-grid">
              <div className="information-item">
                <span>Full Name</span>
                <strong>{user.fullName}</strong>
              </div>

              <div className="information-item">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="information-item">
                <span>Phone</span>
                <strong>{user.phone || "Not available"}</strong>
              </div>

              <div className="information-item">
                <span>Account Type</span>
                <strong>{user.role || "User"}</strong>
              </div>
            </div>
          )}
        </section>

        {/* ================= ACTIVITY ================= */}
        <section className="profile-card">
          <div className="card-header">
            <div>
              <h2>🐾 My Activity</h2>

              <p>Manage your pets and adoption activity</p>
            </div>
          </div>

          <div className="activity-list">
            <button
              className="activity-item"
              onClick={() => navigate("/my-pets")}
            >
              <div className="activity-icon">🐶</div>

              <div className="activity-text">
                <strong>My Pets</strong>
                <span>View and manage your pets</span>
              </div>

              <span className="activity-arrow">→</span>
            </button>

            <button
              className="activity-item"
              onClick={() => navigate("/my-adoptions")}
            >
              <div className="activity-icon">❤️</div>

              <div className="activity-text">
                <strong>My Adoption Requests</strong>
                <span>Track your adoption requests</span>
              </div>

              <span className="activity-arrow">→</span>
            </button>
          </div>
        </section>

        {/* ================= SETTINGS ================= */}
        <section className="profile-card">
          <div className="card-header">
            <div>
              <h2>⚙️ Settings</h2>

              <p>Manage your account preferences</p>
            </div>
          </div>

          {/* CHANGE PASSWORD */}
          <div className="setting-item">
            <div className="setting-left">
              <div className="setting-icon">🔐</div>

              <div>
                <strong>Change Password</strong>

                <span>Update your account password</span>
              </div>
            </div>

            <button
              className="setting-action"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? "Close" : "Change"}
            </button>
          </div>

          {showPasswordSection && (
            <div className="password-form">
              <div className="password-field">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="password-field">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                className="primary-button password-button"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          )}

          {/* NOTIFICATIONS */}
          <div className="setting-item">
            <div className="setting-left">
              <div className="setting-icon">🔔</div>

              <div>
                <strong>Notifications</strong>

                <span>Receive updates about your requests</span>
              </div>
            </div>

            <button
              className={`toggle ${notifications ? "active" : ""}`}
              onClick={handleNotificationToggle}
              aria-label="Toggle notifications"
            >
              <span></span>
            </button>
          </div>

          {/* APPEARANCE */}
          <div className="setting-item">
            <div className="setting-left">
              <div className="setting-icon">{darkMode ? "🌙" : "☀️"}</div>

              <div>
                <strong>Appearance</strong>

                <span>Customize your display</span>
              </div>
            </div>

            <button
              className={`appearance-button ${darkMode ? "dark" : ""}`}
              onClick={handleAppearanceToggle}
            >
              {darkMode ? "Dark" : "Light"}
            </button>
          </div>

          {/* DELETE ACCOUNT */}
          <div className="setting-item delete-setting">
            <div className="setting-left">
              <div className="setting-icon">🗑️</div>

              <div>
                <strong>Delete Account</strong>

                <span>Permanently delete your account</span>
              </div>
            </div>

            <button className="delete-button" onClick={handleDeleteAccount}>
              Delete
            </button>
          </div>
        </section>

        {/* ================= LOGOUT ================= */}
        <button className="logout-profile-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </main>
    </div>
  );
}

export default Profile;
