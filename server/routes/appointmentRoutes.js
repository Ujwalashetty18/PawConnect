const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");
// Logged-in users can create appointments
router.post("/", protect, createAppointment);

// Admin only
router.get("/", protect, admin, getAppointments);

router.get("/:id", protect, admin, getAppointmentById);

router.put("/:id/status", protect, admin, updateAppointmentStatus);

router.delete("/:id", protect, admin, deleteAppointment);

module.exports = router;
