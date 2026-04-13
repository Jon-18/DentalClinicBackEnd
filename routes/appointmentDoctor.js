import express from "express";
import {
  updateAppointmentbyDoctor
} from "../controllers/appointmentController.js";

const router = express.Router();


router.put("/:id", updateAppointmentbyDoctor);

export default router;