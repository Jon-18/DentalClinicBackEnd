import express from "express";
import { getDentists, registerDentist, deleteDentist ,  updateDentist  } from "../controllers/dentistController.js";

const router = express.Router();

router.get("/", getDentists);  // GET /api/dentists
router.post("/", registerDentist);  // POST /api/dentists
router.put("/:id", updateDentist);
router.delete("/:id", deleteDentist);

export default router;
