import {Router} from "express";
import { getCodeforcesStats } from "../controllers/stats/codeforces.controller.js";

const router = Router();
router.get("/codeforces/:handle",getCodeforcesStats);
export default router