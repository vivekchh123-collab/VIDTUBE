import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

import dns from "dns";

// Set custom DNS servers before making the connection
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `✅ Connected to MongoDB! Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
