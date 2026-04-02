import { Router } from "express";
import {
  createInviteController,
  loginController,
  signupController,
  validateInviteController,
  getUserFormsController,
} from "../controllers/authController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/invite", requireAuth, requireAdmin, createInviteController);
router.get("/invite/validate/:token", validateInviteController);
router.get("/me/forms", requireAuth, getUserFormsController);

export default router;
