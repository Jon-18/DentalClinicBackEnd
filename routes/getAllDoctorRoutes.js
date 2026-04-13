import express from "express";
import { getAllDoctor, totalOfDoctor } from "../controllers/allDoctorController.js";

const router = express.Router();

router.get("/", getAllDoctor);  // GET /api/dentists
router.get("/", totalOfDoctor)

export default router;
