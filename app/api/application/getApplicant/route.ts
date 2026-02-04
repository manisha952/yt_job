// app/api/application/getApplicant/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import applicationModels from "@/model/application";
import jobModel from "@/model/job";
import userModel from "@/model/user";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const jobId = request.nextUrl.searchParams.get("jobId");
    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    // ✅ Find all applicants for this job
    const job = await jobModel.findById(jobId).populate({
      path: "applications",
      options: { sort: { created_by: -1 } },
      populate: {
      path: "applicant"
      }
    });

    if (!job) {
      return NextResponse.json(
        { message: "No applicants found for this job" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Job found", job }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error, please try again" },
      { status: 500 }
    );
  }
}
