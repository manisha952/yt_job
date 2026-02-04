import { connectDB } from '@/db/db'
import userModel from '@/model/user'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  await connectDB()

  try {
    const body = await request.json()
    const { bio, skills, study, experience, location } = body

    if (!bio || !skills || !study || !experience || !location) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET not set in environment" },
        { status: 500 }
      )
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      )
    }

    const userId = decoded.id || decoded._id
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      )
    }

    const updateUser = await userModel.findById(userId)
    if (!updateUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    if (!updateUser.profile) {
      updateUser.profile = {}
    }

    updateUser.profile.bio = bio
    updateUser.profile.skills = skills
    updateUser.profile.study = study
    updateUser.profile.experience = experience
    updateUser.profile.location = location

    await updateUser.save()

    // ✅ FIXED RESPONSE
    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updateUser
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error while updating profile:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
