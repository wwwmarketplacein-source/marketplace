import express from "express";

import {
  getKYB,
  submitKYB
} from "../controllers/kyb.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", requireAuth, getKYB);
router.post(
  "/",
  requireAuth,
  upload.array("documents", 5),
  submitKYB
);

export default router;
