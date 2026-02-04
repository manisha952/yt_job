import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import applicationModels from "@/model/application";
import jobModel from "@/model/job";
import userModel from "@/model/user";
import App from "next/app";

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Connect to DB
    await connectDB();
    console.log("MongoDB connected");

    // 2️⃣ Get userId from query
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is not required" },
        { status: 400 }
      );
    }
    console.log("Fetching applications for user:", userId);

    // 3️⃣ Fetch applications for this user
    const applications = await applicationModels
      .find({ applicant: userId })
      .populate({
        path: "job",
        model: jobModel,
        populate: { path: "created_by", model: userModel }
      });

    const appliedJob = applications.map((app) => {
      return {
        applicationId: app._id,
        status: app.status,
        job: app.job,
      }
    })
    
    return NextResponse.json({ message:"Applied job found" ,appliedJob}, { status: 200 });
    
  } catch (error: any) {
    console.error("Error in getapplyjob API:", error.message || error);
    return NextResponse.json(
      { message: "Server error, please try again" },
      { status: 500 }
    );
  }
}
