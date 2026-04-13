import express from "express";
import { getProfile, updateProfile } from "../controllers/profileUserController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getProfile);
router.put("/:id", verifyToken, updateProfile);

export default router;
