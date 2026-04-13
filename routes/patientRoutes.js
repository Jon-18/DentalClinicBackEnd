import express from "express";
import { getPatients, registerPatient, updatePatient,  deletePatient} from "../controllers/patientController.js";

const router = express.Router();

// ✅ RESTful endpoints
router.get("/", getPatients);             // GET /api/patients/
router.post("/", registerPatient);        // POST /api/patients/
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
