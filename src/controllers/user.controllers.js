import User from "../models/user.models.js"; // ✅ Fixed: default import (no braces)

export const registerUser = async (req, res) => {
  try {
    // Access uploaded files from multer
    const avatarFile = req.files.avatar?.[0];
    const coverImageFile = req.files.coverImage?.[0];

    // Get user data from request body
    const { username, email, fullname, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with same username or email already exists",
      });
    }

    // Create avatar and coverImage objects
    const avatarData = {
      url: avatarFile?.path || "https://placehold.co/200x200",
      localPath: avatarFile?.path || "",
    };

    const coverImageData = {
      url: coverImageFile?.path || "",
      localPath: coverImageFile?.path || "",
    };

    // Create new user
    const newUser = await User.create({
      username,
      email,
      fullname,
      password,
      avatar: avatarData,
      coverImage: coverImageData,
    });

    // Fetch created user (password won't be included due to Mongoose defaults)
    const createdUser = await User.findById(newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: createdUser,
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
