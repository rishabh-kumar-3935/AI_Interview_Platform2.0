import {Router} from "express";

import {
    analyzeResume,
    getUserResumes,
    getResumeById,
    deleteResume
} from "../controller/resume.controller.js";

import {verifyJWT} from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js";

const router = Router();

router.route("/analyze").post(
    verifyJWT,
    upload.single("resume"),
    analyzeResume
);


router.route("/history").get(
    verifyJWT,
    getUserResumes
);

router.route("/:resumeId").delete(
    verifyJWT,
    deleteResume
);

export default router;