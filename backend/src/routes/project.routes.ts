import express from "express";

import {
  createProject,
  listProjects,
  submitBid
} from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", requireAuth, listProjects);
router.post("/", requireAuth, createProject);
router.post("/:projectId/bids", requireAuth, submitBid);

export default router;
