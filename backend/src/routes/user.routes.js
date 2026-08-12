import {Router} from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails } from "../controller/user.controller.js";


import {verifyJWT} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJWT,logoutUser);

router.route("/current-user").get(
    verifyJWT,
    getCurrentUser
);

router.route("/change-password").patch(
    verifyJWT,
    updateAccountDetails
);

export default router;