import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const { Schema } = mongoose;

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Tweet content is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

tweetSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("Tweet", tweetSchema);
