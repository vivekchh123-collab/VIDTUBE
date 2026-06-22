import { Router } from "express";
import { registerUser,logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, getWatchHistory } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import User from "../models/user.models.js"; // ✅ Fixed: default import (no braces)
import { verifyJWT } from "../middlewares/auth.middleware.js"; 

const router = Router(); 
 
//unsecured routes

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken);


//secured routes

router.route("/logout").post(verifyJWT,logoutUser);
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").post(verifyJWT, getCurrentUser);

router.route("/c/:username").post(verifyJWT, getUseChannelProfile);

router.route("/update-account").post(verifyJWT, updateAccountDetails);


router.route("/avatar").post(verifyJWT,  updateUserAvatar);

router.route("/change-password").post(verifyJWT, upload.single("avatar" ) , changeCurrentPassword);

router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), 
updateCoverImage);

router
  .route("/history")
  .post(verifyJWT, getWatchHistory);
 



export default router;
