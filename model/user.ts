import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    bio: { type: String, default: "" },
    skills: [{ type: String, default: [] }],
    study: { type: String, default: "" },
    experience: [{ type: String, default: [] }],
    location: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "recruiter"],
    default: "student",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profile: {           // <-- Corrected typo here
    type: profileSchema,
    required: true,
    default: () => ({}),
  },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
