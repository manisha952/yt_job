import { connectDB } from '@/db/db'
import { NextRequest, NextResponse } from 'next/server'
import companyModel from '@/model/company';
import userModel from '@/model/user'
import mongoose from "mongoose";


export async function GET() {
    return NextResponse.json({ message: "API working" });
}
export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const body = await request.json();
        const { title, description, location, website, logo } = body;

        if (!title || !description || !location) {
            return NextResponse.json(
                { message: "all field are required" },
                { status: 400 }
            )
        }

        // get user
        const userId = request.headers.get("userId");
        if (!userId) {
            return NextResponse.json(
                { message: "userId is reuired" },
                { status: 400 }
            )
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 },
            )
        }
        const company = await
            companyModel.create({
                title,
                description,
                location, 
                website,
                logo,
                userId: user._id

                
            });
        return NextResponse.json({
            message: "Company created sucessfully",

            company: {
                id: company._id,
                title: company.title,
                description: company.description,
                location: company.location,
                website: company.website,
                logo: company.logo,
                userId: user._id
               
            },
        },

            { status: 201 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: "internal server error" },
            { status: 500 },
        )
    }
}