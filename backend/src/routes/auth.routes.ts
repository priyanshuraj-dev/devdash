import { Router } from "express";
import { signup } from "../controllers/auth/signup.controller.js";
import { verifyEmail } from "../controllers/auth/verifyEmail.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { logout } from "../controllers/auth/logout.controller.js";
import { login } from "../controllers/auth/login.controller.js";
import { refreshAcessToken } from "../controllers/auth/refresh.controller.js";
import { getMe } from "../controllers/auth/me.controller.js";
import { forgotPassword } from "../controllers/auth/forgotPassword.controller.js";
import { resetPassword } from "../controllers/auth/resetPassword.controller.js";
import { forgotPasswordLimiter, loginLimiter, signupLimiter } from "../middleware/rateLimit.js";
const router =  Router();

router.post("/signup",signupLimiter,signup);
router.post("/login",loginLimiter,login);
router.get("/verify-email",verifyEmail)
router.post("/logout",logout)
router.post("/refresh",refreshAcessToken)
router.post("/me",verifyJWT,getMe)
router.post("/forgot-password",forgotPasswordLimiter,forgotPassword)
router.post("/reset-password",resetPassword)
export default router;