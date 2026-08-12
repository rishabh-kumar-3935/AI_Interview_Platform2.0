import {Router} from "express";

import { generateInterviewQuestions,
    getInterviewHistory,
    deleteInterviewHistory
}  from "../controller/interview.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/generate").post(
    verifyJWT,
    generateInterviewQuestions
)

router.route("/history").get(
    verifyJWT,
    getInterviewHistory
);


export default router;