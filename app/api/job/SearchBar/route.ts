
import { connectDB } from "@/db/db";
import jobModel from "@/model/job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm =request.nextUrl.searchParams.get("searchTerm");
        console.log("Search term received:", searchTerm);
        if (!searchTerm) {
            return NextResponse.json(
                { message: "Missing search term" },
                { status: 400 }
            )
        }
        const jobs = await jobModel.find({
           $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    });
    console.log("Jobs found:", jobs.length);
    return NextResponse.json({jobs},{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"Error fetching jobs"}, { status: 500 })
    }

}
