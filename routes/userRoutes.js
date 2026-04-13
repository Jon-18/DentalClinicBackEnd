import express from "express";
import { getUsers, updateUser } from "../controllers/userController.js";

const router = express.Router();

// GET /api/users
router.get("/", getUsers);
router.get("/", updateUser);

export default router;
