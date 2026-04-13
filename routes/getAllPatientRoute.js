import express from "express";
import { createAppointmentAdmin, getAllPatient } from "../controllers/allPatientController.js";

const router = express.Router();

router.get("/", getAllPatient); 
router.post("/", createAppointmentAdmin); 


export default router;
