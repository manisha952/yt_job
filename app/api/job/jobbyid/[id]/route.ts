import { connectDB } from "@/db/db";
import jobModel from "@/model/job";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    // 🔥 MOST IMPORTANT FIX
    const { id : jobId} = await context.params;

    // safety check
    if (!jobId) {
      return NextResponse.json(
        { message: " Job ID not found "},
        { status: 400 }
      );
    }

    const job = await jobModel.findById(jobId).populate("company");

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message:"job found",job },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error to finding job", error);
    return NextResponse.json(
      { message: "Error to finding job" },
      { status: 500 }
    );
  }
}
