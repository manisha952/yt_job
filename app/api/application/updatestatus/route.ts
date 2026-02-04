import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import applicationModels from "@/model/application";

export async function PATCH(request: NextRequest) {
  await connectDB();

  try {
    const { applicantId, newstatus } = await request.json();

    // Validation
    if (!applicantId || !newstatus) {
      return NextResponse.json(
        { message: "Application ID and status are required" },
        { status: 400 }
      );
    }

    const validateStatus = ["pending", "accepted", "rejected"]
    if (!validateStatus.includes(newstatus)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const application = await applicationModels.findById(applicantId);
    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    const updateApplication = await applicationModels.findByIdAndUpdate(applicantId ,{status:newstatus}, {new:true}).populate("applicant","name email")

    if(!updateApplication){
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );}
    // application.status = newstatus;
    // await application.save();

    return NextResponse.json({
      message: `Application status updated to ${newstatus}`,
      application,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
