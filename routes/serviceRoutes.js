import express from "express";
import { getServices, registerService, updateService, deleteService  } from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);     // GET /api/services
router.post("/", registerService); // POST /api/services
router.put("/:id", updateService);
router.delete("/:id", deleteService);


export default router;
