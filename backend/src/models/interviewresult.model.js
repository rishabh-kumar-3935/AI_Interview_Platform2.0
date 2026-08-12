import mongoose, { Schema } from "mongoose";

const interviewResultSchema = new Schema(
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
    score: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
    completedQuestions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const InterviewResult = mongoose.model("InterviewResult", interviewResultSchema);
