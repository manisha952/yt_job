import { connectDB } from "@/db/db";
import jobModel from "@/model/job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const jobs = await jobModel.find({}).populate("company"); //getjob==jobs
     console.log("Jobs fetched:", jobs);

    if (!jobs || jobs.length === 0) {
      return NextResponse.json(
        { success: true, message: "No jobs found"},
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Job list found", jobs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching job list" },
      { status: 500 }
    );
  }
}
