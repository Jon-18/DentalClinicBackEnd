import express from "express";
import fs from "fs";
import multer from "multer";
import { createAppointment, getAppointments, updateAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

// Ensure upload folder exists
const uploadDir = "./uploadsReceipt";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const fname = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, `${fname}.${ext}`);
  },
});
const upload = multer({ storage });


// Routes
router.post("/create", upload.single("receipt"), createAppointment);

router.get("/", getAppointments);
router.put("/:id", updateAppointment);

export default router;
