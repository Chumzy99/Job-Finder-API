import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, "Please specify position"],
      maxlength: 50,
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
    },
    location: {
      type: String,
      required: [true, "Please provide job location"],
    },
    languageCategory: {
      type: String,
      required: [true, "Please provide job category"],
    },
    howToApply: {
      type: String,
      required: [true, "Please provide how to apply"],
    },
    companyUrl: {
      type: String,
      required: [true, "Please provide job url"],
    },
    description: {
      type: String,
      required: [true, "Please provide job description"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
