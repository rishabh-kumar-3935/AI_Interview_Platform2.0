import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeName: {
      type: String,
      required: true,
      trim: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    atsScore: {
      type: Number,
      required: true,
    },

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    suggestions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model("Resume", resumeSchema);