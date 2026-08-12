import mongoose, { Schema } from "mongoose";

const interviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfQuestions: {
      type: Number,
      required: true,
    },
    questions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Interview = mongoose.model("Interview", interviewSchema);
