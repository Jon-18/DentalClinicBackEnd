import express from "express";
import { getAllAppointments } from "../controllers/allAppointmentsController.js";

const router = express.Router();

router.get("/", getAllAppointments);  // GET /api/dentists

export default router;
