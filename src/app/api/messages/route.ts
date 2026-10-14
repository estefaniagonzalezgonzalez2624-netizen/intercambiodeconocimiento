import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { eq, or, and, asc } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const userId1 = Number(searchParams.get("userId1") || "1");
    const userId2 = Number(searchParams.get("userId2") || "2");

    const chatMessages = await db
      .select({
        id: messages.id,
        exchangeId: messages.exchangeId,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        text: messages.text,
        proposalData: messages.proposalData,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({ messages: chatMessages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderId, receiverId, text, exchangeId, proposalData } = body;

    const [newMessage] = await db
      .insert(messages)
      .values({
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        text,
        exchangeId: exchangeId ? Number(exchangeId) : null,
        proposalData: proposalData ? JSON.stringify(proposalData) : null,
      })
      .returning();

    return NextResponse.json({ message: newMessage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
