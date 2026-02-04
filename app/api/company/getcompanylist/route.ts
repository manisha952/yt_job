import { NextResponse, NextRequest } from "next/server";
import companyModel from "@/model/company";
import { connectDB } from "@/db/db";

export async function GET(request: NextRequest) {
    await connectDB();
    try {
        const getAllCompany = await companyModel.find({});
        const formatted = getAllCompany.map(c => ({
            _id: c._id,
            name: c.title,
            logo: c.logo
        }));
        return NextResponse.json({ message: "Company List", data: formatted }, { status: 200 });

        // Always return the response
        return NextResponse.json(
            { message: "Company List", data: getAllCompany },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

