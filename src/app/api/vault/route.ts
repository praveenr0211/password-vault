import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VaultItem from "@/models/VaultItem";
import { getUserFromRequest } from "@/lib/auth";
import { z } from "zod";

const createItemSchema = z.object({
  title: z.string().min(1),
  username: z.string().min(1),
  passwordCipher: z.string(),
  url: z.string().optional(),
  notesCipher: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

/**
 * GET all vault items for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const items = await VaultItem.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Get vault items error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST create new vault item
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createItemSchema.parse(body);

    await dbConnect();

    const item = await VaultItem.create({
      userId: user.userId,
      ...data,
    });

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: (error as any).errors },
        { status: 400 }
      );
    }

    console.error("Create vault item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
