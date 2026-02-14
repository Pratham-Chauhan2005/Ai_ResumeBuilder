import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createResume, deleteResume, getResumesById, getPublicResumeById,updateResume,getDashboardResumes } from "../controller/resumeController.js";
import upload from "../config/multer.js";

const router = Router();

router.post("/create", protect, createResume);
router.put("/update", protect, upload.single("image"), updateResume);
router.delete("/delete/:resumeId", protect, deleteResume);
router.get("/get/:resumeId", protect, getResumesById);
router.get("/public/:resumeId", getPublicResumeById);
router.get("/dashboard", protect, getDashboardResumes);

export default router;
