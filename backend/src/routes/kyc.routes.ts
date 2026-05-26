import express from "express";

import {
  getKYC,
  submitKYC
} from "../controllers/kyc.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", requireAuth, getKYC);
router.post(
  "/",
  requireAuth,
  upload.single("selfie"),
  submitKYC
);

export default router;
