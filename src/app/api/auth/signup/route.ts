import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import { generateSalt } from "@/lib/crypto";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = signupSchema.parse(body);

    await dbConnect();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate encryption salt for this user
    const encSalt = generateSalt();

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      encSalt,
    });

    // Generate JWT
    const token = generateToken({
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
    });

    return NextResponse.json({
      token,
      user: {
        id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        encSalt: user.encSalt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
