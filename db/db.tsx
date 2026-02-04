
import mongoose from "mongoose";

export async function connectDB() {
  try {

    // // ✅ ADD ONLY THIS LINE
    // console.log(" MONGO_URI FROM ENV:", process.env.MONGO_URI);

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("✅ Connected to MongoDB");
    });

    connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

  } catch (error) {
    console.error("❌ Something went wrong while connecting to DB:", error);
  }
}
