import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, "Server is healthy", {
        message: "Server is healthy",
      }),
    );
});

export { healthCheck };
