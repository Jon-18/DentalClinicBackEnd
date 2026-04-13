import express from "express";
import {
  updateAppointmentbyAdmin
} from "../controllers/appointmentController.js";

const router = express.Router();


router.put("/:id", updateAppointmentbyAdmin);

export default router;