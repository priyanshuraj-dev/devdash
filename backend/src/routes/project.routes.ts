import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createProject } from "../controllers/project/createProject.controller.js";
import { getMyProjects } from "../controllers/project/getMyProjects.controller.js";
import { updateProject } from "../controllers/project/updateProject.controller.js";
import { deleteProject } from "../controllers/project/deleteProject.controller.js";

const router = Router();
router.post("/",verifyJWT,createProject)
router.get("/me",verifyJWT,getMyProjects)
router.patch("/:projectId",verifyJWT,updateProject)
router.delete("/:projectId",verifyJWT,deleteProject)
export default router