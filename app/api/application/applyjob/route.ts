import { NextRequest, NextResponse } from "next/server";
import jobModel from "@/model/job";
import { connectDB } from "@/db/db";
import applicationModels from "@/model/application";
import userModel from "@/model/user";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const { jobId, applicantId } = await request.json();

    if (!jobId || !applicantId) {
      return NextResponse.json(
        { message: "Job Id and applicant Id are required" },
        { status: 400 }
      );
    }

    const job = await jobModel.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    const applicant = await userModel.findById(applicantId);
    if (!applicant) {
      return NextResponse.json(
        { message: "Applicant not found" },
        { status: 404 }
      );
    }

    const existingApplication = await applicationModels.findOne({
      job: jobId,
      applicant: applicantId,
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied for this job" },
        { status: 409 }
      );
    }

    const newApplication = new applicationModels({
      job: jobId,
      applicant: applicantId,
      status: "pending",
    });

    await newApplication.save();

    await jobModel.findByIdAndUpdate(jobId, {
      $push: { applications: newApplication._id },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error, please try again" },
      { status: 500 }
    );
  }
}
