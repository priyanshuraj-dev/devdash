import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { uploadImages } from "../controllers/media/upload.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { deleteImage } from "../controllers/media/delete.controller.js";
const router = Router()

router.post("/upload",verifyJWT,upload.array("images",5),uploadImages)
router.delete("/delete",verifyJWT,deleteImage)

export default router;