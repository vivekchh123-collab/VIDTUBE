import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js"; // ✅ Added .js extension

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError instances to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);

    error = new ApiError(
      statusCode,
      error.message || "Something went wrong",
      error?.errors || [],
      err.stack
    );
  }

  // Build response object
  const response = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  };

  // Return error response
  return res
  .status(error.statusCode)
  .json(response);
};

export { errorHandler };
