import express from "express";
import { login, logout, refreshToken, signup } from "../controllers/authController.js";

const router = express.Router();

// Authentication
router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
