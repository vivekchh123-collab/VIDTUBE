import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const { Schema } = mongoose;

const videoSchema = new Schema(
  {
    videoFile: {
      url: { type: String, required: true },
      localPath: { type: String },
    },
    thumbnail: {
      url: { type: String, required: true },
      localPath: { type: String },
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // duration in seconds (from Cloudinary/s3)
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("Video", videoSchema);
