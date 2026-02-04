
import mongoose, { Schema } from "mongoose";

const applicationsSchema = new mongoose.Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const applicationModels =
  mongoose.models.Application || mongoose.model("Application", applicationsSchema);

export default applicationModels;


   

