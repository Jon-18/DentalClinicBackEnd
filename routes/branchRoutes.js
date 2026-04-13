import express from "express";
import { getBranches, registerBranch, updateBranch, deleteBranch} from "../controllers/branchController.js";

const router = express.Router();

router.get("/", getBranches);     // GET /api/branches
router.post("/", registerBranch); // POST /api/branches
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

export default router;
