import { Router } from "express";
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume } from "../controller/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
router.post("/enhance-job-desc", protect, enhanceJobDescription);
router.post("/upload-resume", protect, uploadResume);

export default router;