import { connectDB } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import userModel from "@/model/user";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, role } = body || {};

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "All the fields are required" },
        { status: 400 }
      );
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
        { message: "Role mismatch" },
        { status: 403 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET not set" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "9d" }
    );

    return NextResponse.json(
      { message: "Successful login", user, token },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
