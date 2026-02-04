import { connectDB } from "@/db/db";
import jobModel from "@/model/job";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const body = await request.json();

    const {
      title,
      description,
      location,
      salary,
      experinceLevel,
      requirement,
      jobType,
      position,
      company,
      created_by,
    } = body;

    //validate
    
    if (
      !title ||
      !description ||
      !location ||
      !salary ||
      !experinceLevel||
      !requirement ||
      !jobType ||
      !position ||
      !company 
      
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newJob = await jobModel.create({
      title,
      description,
      location,
      salary,
      experinceLevel,
      requirement, 
      jobType,
      position,
      company,
      created_by, 
    });

    return NextResponse.json(
      {
        success: true,
        message: "Job created successfully",
        newJob,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Error to creating job",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
