import {Router} from "express";
import { askConceptQuestion,
    getConceptHistory,
    deleteConceptHistory
}  from "../controller/concept.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/ask").post(
    verifyJWT,
    askConceptQuestion
);

router.route("/history").get(
    verifyJWT,
    getConceptHistory
);

router.route("/:conceptId").delete(
    verifyJWT,
    deleteConceptHistory
);
export default router;