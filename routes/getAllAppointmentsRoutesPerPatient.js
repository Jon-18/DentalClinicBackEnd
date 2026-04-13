import express from "express";
import { getAllAppointmentsPerPatient, getIdForPatient } from "../controllers/AllAppointmentsPerPatientController.js";

const router = express.Router();

router.get("/:id/appointments", getAllAppointmentsPerPatient);// GET /api/dentists
router.get("/:id", getIdForPatient);

export default router;
