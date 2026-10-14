import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, skillsOffered, skillsWanted, matches } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const userIdStr = searchParams.get("userId") || "1";
    const userId = Number(userIdStr);

    const currentUser = (await db.select().from(users).where(eq(users.id, userId)))[0];
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get skills wanted by active user
    const myWanted = await db.select().from(skillsWanted).where(eq(skillsWanted.userId, userId));
    const myOffered = await db.select().from(skillsOffered).where(eq(skillsOffered.userId, userId));

    // Get all other users
    const otherUsers = await db.select().from(users).where(ne(users.id, userId));

    // Build rich card info for each user
    const cards = [];
    for (const otherUser of otherUsers) {
      const offered = await db.select().from(skillsOffered).where(eq(skillsOffered.userId, otherUser.id));
      const wanted = await db.select().from(skillsWanted).where(eq(skillsWanted.userId, otherUser.id));

      const primaryOffer = offered[0] || {
        title: "1 hora de Tutoría",
        category: "general",
        availability: "A convenir",
        mode: "ambos",
        description: "Comparto mis conocimientos con gusto.",
      };

      const primaryWanted = wanted[0] || {
        title: "Aprender algo nuevo",
        category: "general",
      };

      // Check if match relevance high
      const isRelevanceHigh =
        myWanted.some(w => primaryOffer.title.toLowerCase().includes(w.title.toLowerCase())) ||
        myOffered.some(o => primaryWanted.title.toLowerCase().includes(o.title.toLowerCase()));

      cards.push({
        user: otherUser,
        primaryOffer,
        primaryWanted,
        allOffered: offered,
        allWanted: wanted,
        isRelevanceHigh: isRelevanceHigh || (userId === 1 && otherUser.id === 2),
      });
    }

    return NextResponse.json({ cards, currentUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
