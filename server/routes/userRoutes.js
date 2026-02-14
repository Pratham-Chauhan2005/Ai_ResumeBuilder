import {Router} from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { loginUser,registerUser,logoutUser,getUserById,getUserResumes } from "../controller/userController.js";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserById);
router.get("/resumes", protect, getUserResumes);

export default router;