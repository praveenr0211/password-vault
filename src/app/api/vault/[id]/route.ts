import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VaultItem from "@/models/VaultItem";
import { getUserFromRequest } from "@/lib/auth";
import { z } from "zod";

const updateItemSchema = z.object({
  title: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  passwordCipher: z.string().optional(),
  url: z.string().optional(),
  notesCipher: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * PUT update vault item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = updateItemSchema.parse(body);

    await dbConnect();

    const item = await VaultItem.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: (error as any).errors },
        { status: 400 }
      );
    }

    console.error("Update vault item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE vault item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const item = await VaultItem.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete vault item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
