import { connectDB } from "@/db/db";
import jobModel from "@/model/job";
import { NextRequest, NextResponse } from "next/server";
import '@/model/company'


export async function GET(
  request: NextRequest,
  context : { params : Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const  {id} = await context.params;;

    if (!id) {
      return NextResponse.json(
        { message: "Recruiter ID not found" },
        { status: 400 }
      );
    }

    const jobs = await jobModel.find({ created_by: id }).populate("company");
    if(jobs.length===0){
      return NextResponse.json(
        {message:"Job not found for the recruiter"},
        {status:400}
      )
    }

    return NextResponse.json(
      { success: true, jobs },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("🔥 ERROR to finding recruiter job", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
