import express from "express";
import { createServices, getAllServices } from "../controllers/allServicesController.js";

const router = express.Router();

router.get("/", getAllServices);  // GET /api/dentists
router.get("/", createServices);
export default router;
