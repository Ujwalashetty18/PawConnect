const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
  updateProfileImage,
  deleteAccount,
} = require("../controllers/userController");

// Get profile
router.get("/profile", protect, getProfile);

// Update name + phone
router.put("/profile", protect, updateProfile);

// Change password
router.put("/change-password", protect, changePassword);

// Notifications
router.put("/notifications", protect, updateNotifications);

// Profile image
router.put(
  "/profile-image",
  protect,
  upload.single("image"),
  updateProfileImage,
);

// Delete account
router.delete("/account", protect, deleteAccount);

module.exports = router;
