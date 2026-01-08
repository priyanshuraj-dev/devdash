import { Router } from "express";
import { getPublicPortfolio } from "../controllers/portfolio/getPortfolio.controller.js";

const router = Router();

router.get("/:username",getPublicPortfolio);

export default router;