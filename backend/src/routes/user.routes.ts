import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user/updateProfile.controller.js";

const router = Router();
router.patch("/profile",verifyJWT,updateProfile)
export default router;