import mongoose, { Schema, model, models } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    experinceLevel: {
      type: Number,
      required: true,
    },

    requirement: [
      {type: String,}
    ],

    jobType: {
      type: String,
      required: true,
    },

    position: {
      type: Number,
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // ✅ REQUIRED FIELD
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications:[
      {
        type:mongoose.Schema.ObjectId,
        ref :"Application"
      },
    ],
  },
  { timestamps: true }
);

const jobModel = mongoose.models.Job || mongoose.model("Job" ,jobSchema)
export default jobModel;


