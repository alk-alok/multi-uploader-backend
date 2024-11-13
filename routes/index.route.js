import { Router } from "express";
import upload from "../utils/uploader.js";
import { uploadFiles, downloadLinks, getAllList } from "../controllers/file.controller.js";

const router = Router();

router.post("/upload", upload, uploadFiles);
router.post("/download", downloadLinks);
router.get("/all-files", getAllList);

export default router;