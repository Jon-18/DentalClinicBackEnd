import express from "express";
import { getAppointmentsByPatientId } from "../controllers/allPatientHistoryByUser.js";

const router = express.Router();
router.get("/", getAppointmentsByPatientId);

export default router;
