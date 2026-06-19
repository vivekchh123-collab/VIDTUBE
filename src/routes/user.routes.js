import { Router } from "express";
import { registerUser,logoutUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import User from "../models/user.models.js"; // ✅ Fixed: default import (no braces)
import { verifyJWT } from "../middlewares/auth.middleware.js"; 

const router = Router();

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

router.route("/logout").post(verifyJWT,logoutUser);

export default router;
