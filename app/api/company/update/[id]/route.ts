import { connectDB } from '@/db/db'
import { NextRequest, NextResponse } from 'next/server'
import companyModel from '@/model/company'
import userModel from '@/model/user'
import cloudinary from '@/lib/clodinary'
import mongoose from 'mongoose'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB()

    try {
         const {id: companyId} =  await params
        // if (!mongoose.Types.ObjectId.isValid(companyId)) {
        //     return NextResponse.json({ message: "Invalid company ID" }, { status: 400 })
        // }

        const body = await request.json()
        const { title, description, location, website, logo } = body

        let updateLogo : string | undefined = undefined

        if (logo && logo .startsWith("data:image/")) {
            try {
                const updateResult = await cloudinary.uploader.upload(logo, {
                    folder: "company_logo"
                })
                updateLogo = updateResult.secure_url
            } catch (error){

                console.log("Cloudinary upload error:", error)
                return NextResponse.json({ message: "Logo upload failed" }, { status: 500 })

            }
        }

       

        const updateCompany = await companyModel.findByIdAndUpdate(
            companyId,
            {
                title,
                description,
                location,
                website,
                ...(updateLogo && {logo : updateLogo})
            },
            
            { new: true }
        )

        if (!updateCompany) {
            return NextResponse.json(
                { message: "company not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "company updated sucessfully", company: updateCompany },
            { status: 200 }
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "internal server error" },
            { status: 500 }
        )
    }
}
