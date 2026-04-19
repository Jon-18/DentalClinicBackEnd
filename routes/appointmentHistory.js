import express from "express";
import { getAllAppointmentswithServiceName } from "../controllers/allPatientHistoryController.js";

const router = express.Router();
router.get("/", getAllAppointmentswithServiceName);

export default router;
