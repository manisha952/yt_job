import { connectDB } from '@/db/db'
import { NextRequest, NextResponse } from 'next/server'
import companyModel from '@/model/company'
import userModel from '@/model/user'

export async function GET(request: NextRequest) {
    await connectDB();

    try {
        const userId = request.headers.get("userId");

        if (!userId) {
            return NextResponse.json(
                { message: "userId is required" },
                { status: 400 }
            );
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const company = await companyModel.find({ userId : userId});

        if (company.length === 0) {
            return NextResponse.json(
                { message: "Company not found for this user" },
                { status: 404 }
            );
        }
        

        return NextResponse.json(
            { message : "Company fetched successfully", company },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

