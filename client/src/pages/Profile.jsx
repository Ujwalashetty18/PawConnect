import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "http://localhost:5000/api";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);

  const [editingProfile, setEditingProfile] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [showSettings, setShowSettings] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState(true);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // ========================================
  // GET PROFILE
  // ========================================
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      setUser(data.user);

      setFullName(data.user.fullName || "");
      setPhone(data.user.phone || "");

      setNotifications(data.user.notificationsEnabled !== false);

      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, []);

  // ========================================
  // THEME
  // ========================================
  useEffect(() => {
    document.body.classList.remove("dark-theme");

    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // ========================================
  // EDIT PROFILE
  // ========================================
  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          fullName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);

      localStorage.setItem("user", JSON.stringify(data.user));

      setEditingProfile(false);

      alert("Profile updated successfully");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // PROFILE IMAGE
  // ========================================
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/users/profile-image`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      setUser(data.user);

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile picture updated");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // CHANGE PASSWORD
  // ========================================
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/users/change-password`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password change failed");
      }

      alert("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowPasswordModal(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // NOTIFICATIONS
  // ========================================
  const handleNotifications = async (enabled) => {
    setNotifications(enabled);

    try {
      const response = await fetch(`${API_URL}/users/notifications`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          enabled,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);

      setNotifications(!enabled);

      alert("Unable to update notification setting");
    }
  };

  // ========================================
  // DELETE ACCOUNT
  // ========================================
  const handleDeleteAccount = async () => {
    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/users/account`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("theme");

      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOGOUT
  // ========================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return <div className="profile-loading">Loading your profile...</div>;
  }

  if (!user) {
    return null;
  }

  const imageUrl = user.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : null;

  return (
    <div className="profile-page">
      {/* ========================================
          NAVBAR
      ======================================== */}

      <nav className="profile-navbar">
        <div className="profile-logo" onClick={() => navigate("/home")}>
          🐾 PawConnect
        </div>

        <button className="back-home-button" onClick={() => navigate("/home")}>
          ← Home
        </button>
      </nav>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="profile-container">
        {/* HEADER */}

        <section className="profile-header">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" />
              ) : user.fullName ? (
                user.fullName.charAt(0).toUpperCase()
              ) : (
                "U"
              )}
            </div>

            <button
              className="camera-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              📷
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageUpload}
              hidden
            />
          </div>

          <div className="profile-header-info">
            <h1>{user.fullName}</h1>

            <p>Manage your PawConnect account</p>
          </div>
        </section>

        {/* ========================================
            PERSONAL INFORMATION
        ======================================== */}

        <section className="profile-card">
          <div className="section-title">
            <h2>👤 Personal Information</h2>

            {!editingProfile && (
              <button
                className="edit-button"
                onClick={() => {
                  setFullName(user.fullName || "");
                  setPhone(user.phone || "");
                  setEditingProfile(true);
                }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="edit-profile-form">
              <div className="form-group">
                <label>Full Name</label>

                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input value={user.email || ""} disabled />

                <small>Email cannot be changed.</small>
              </div>

              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={() => setEditingProfile(false)}
                >
                  Cancel
                </button>

                <button
                  className="save-button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info-grid">
              <div className="info-item">
                <span>Full Name</span>
                <strong>{user.fullName || "Not available"}</strong>
              </div>

              <div className="info-item">
                <span>Email</span>
                <strong>{user.email || "Not available"}</strong>
              </div>

              <div className="info-item">
                <span>Phone</span>
                <strong>{user.phone || "Not available"}</strong>
              </div>

              <div className="info-item">
                <span>Account Type</span>
                <strong>{user.role || "user"}</strong>
              </div>
            </div>
          )}
        </section>

        {/* ========================================
            ACTIVITY
        ======================================== */}

        <section className="profile-card">
          <h2>🐾 My Activity</h2>

          <div className="profile-actions">
            <button onClick={() => navigate("/my-pets")}>
              <span>🐶</span>

              <div>
                <strong>My Pets</strong>

                <small>View and manage your pets</small>
              </div>

              <b>›</b>
            </button>

            <button onClick={() => navigate("/my-adoptions")}>
              <span>❤️</span>

              <div>
                <strong>My Adoption Requests</strong>

                <small>Track your adoption requests</small>
              </div>

              <b>›</b>
            </button>
          </div>
        </section>

        {/* ========================================
            SETTINGS
        ======================================== */}

        <section className="profile-card settings-card">
          <div
            className="settings-heading"
            onClick={() => setShowSettings(!showSettings)}
          >
            <div>
              <h2>⚙️ Settings</h2>

              <p>Manage your account preferences</p>
            </div>

            <span>{showSettings ? "▲" : "▼"}</span>
          </div>

          {showSettings && (
            <div className="settings-list">
              {/* CHANGE PASSWORD */}

              <button
                className="setting-item"
                onClick={() => setShowPasswordModal(true)}
              >
                <span>🔐</span>

                <div>
                  <strong>Change Password</strong>

                  <small>Update your account password</small>
                </div>

                <b>›</b>
              </button>

              {/* NOTIFICATIONS */}

              <div className="setting-item">
                <span>🔔</span>

                <div>
                  <strong>Notifications</strong>

                  <small>Receive updates about your requests</small>
                </div>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => handleNotifications(e.target.checked)}
                  />

                  <span></span>
                </label>
              </div>

              {/* APPEARANCE */}

              <div className="setting-item">
                <span>{theme === "dark" ? "🌙" : "☀️"}</span>

                <div>
                  <strong>Appearance</strong>

                  <small>Choose how PawConnect looks</small>
                </div>

                <select
                  className="theme-select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>

                  <option value="dark">Dark</option>
                </select>
              </div>

              {/* DELETE */}

              <button
                className="setting-item danger"
                onClick={() => setShowDeleteModal(true)}
              >
                <span>🗑️</span>

                <div>
                  <strong>Delete Account</strong>

                  <small>Permanently delete your account</small>
                </div>

                <b>›</b>
              </button>
            </div>
          )}
        </section>

        {/* LOGOUT */}

        <button className="profile-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </main>

      {/* ========================================
          PASSWORD MODAL
      ======================================== */}

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>🔐 Change Password</h2>

                <p>Keep your PawConnect account secure.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Current Password</label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>

              <button
                className="save-button"
                onClick={handleChangePassword}
                disabled={saving}
              >
                {saving ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          DELETE MODAL
      ======================================== */}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-card delete-modal">
            <div className="delete-icon">🗑️</div>

            <h2>Delete your account?</h2>

            <p>
              This action cannot be undone. Your PawConnect account will be
              permanently deleted.
            </p>

            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="delete-button"
                onClick={handleDeleteAccount}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
