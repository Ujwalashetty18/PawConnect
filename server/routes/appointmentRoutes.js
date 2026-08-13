const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");
const protect = require("../middleware/authMiddleware");
router.post("/", protect, createAppointment);
router.get("/", protect, getAppointments);
router.get("/:id", protect, getAppointmentById);
router.put("/:id/status", protect, updateAppointmentStatus);
router.delete("/:id", protect, deleteAppointment);

module.exports = router;
