import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VaultItem from "@/models/VaultItem";
import { getUserFromRequest } from "@/lib/auth";
import { z } from "zod";

const importItemSchema = z.object({
  title: z.string().min(1),
  username: z.string().min(1),
  passwordCipher: z.string(),
  url: z.string().optional(),
  notesCipher: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

const importSchema = z.object({
  items: z.array(importItemSchema),
});

/**
 * POST import multiple vault items
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = importSchema.parse(body);

    await dbConnect();

    // Add userId to all items
    const itemsToInsert = data.items.map((item) => ({
      ...item,
      userId: user.userId,
    }));

    // Bulk insert
    const result = await VaultItem.insertMany(itemsToInsert);

    return NextResponse.json({
      success: true,
      count: result.length,
      items: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid import data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Import vault items error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
