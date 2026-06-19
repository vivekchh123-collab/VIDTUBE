import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      url: { type: String, default: "https://placehold.co/200x200" },
      localPath: { type: String, default: "" },
    },
    coverImage: {
      url: { type: String, default: "" },
      localPath: { type: String, default: "" },
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook wrapped in try/catch
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password validity
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

// Instance method to generate short-lived Access Token
userSchema.methods.generateAccessToken = function () {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET environment variable is missing.");
    }

    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
      }
    );
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};

// Instance method to generate long-lived Refresh Token
userSchema.methods.generateRefreshToken = function () {
  try {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET environment variable is missing.");
    }

    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
      }
    );
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw error;
  }
};

userSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("User", userSchema);
