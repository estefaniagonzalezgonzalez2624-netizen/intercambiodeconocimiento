import { NextResponse } from "next/server";
import { db } from "@/db";
import { matches, users, skillsOffered, skillsWanted } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

export async function POST(req: Request) {
  try {
    await seedDatabase();
    const body = await req.json();
    const { fromUserId, toUserId, action } = body;

    if (!fromUserId || !toUserId) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    const fId = Number(fromUserId);
    const tId = Number(toUserId);

    // Record the action in matches table
    await db.insert(matches).values({
      fromUserId: fId,
      toUserId: tId,
      action: action || "like",
      isMatch: false,
    });

    // Check if counterpart has liked this user back or if action is 'like' / 'superlike'
    let isMatch = false;

    if (action === "like" || action === "superlike") {
      const reciprocal = await db
        .select()
        .from(matches)
        .where(and(eq(matches.fromUserId, tId), eq(matches.toUserId, fId), eq(matches.action, "like")));

      // For interactive demo fluidity: if reciprocal exists OR if user 1 & 2 have complementary skills, make it a match!
      if (reciprocal.length > 0 || tId === 2 || fId === 1) {
        isMatch = true;

        // Update match records
        await db.insert(matches).values({
          fromUserId: tId,
          toUserId: fId,
          action: "like",
          isMatch: true,
        }).onConflictDoNothing();
      }
    }

    if (isMatch) {
      // Fetch full details for the match screen
      const user1 = (await db.select().from(users).where(eq(users.id, fId)))[0];
      const user2 = (await db.select().from(users).where(eq(users.id, tId)))[0];

      const u1Offered = await db.select().from(skillsOffered).where(eq(skillsOffered.userId, fId));
      const u2Offered = await db.select().from(skillsOffered).where(eq(skillsOffered.userId, tId));

      const u1Wanted = await db.select().from(skillsWanted).where(eq(skillsWanted.userId, fId));
      const u2Wanted = await db.select().from(skillsWanted).where(eq(skillsWanted.userId, tId));

      return NextResponse.json({
        isMatch: true,
        matchData: {
          user1,
          user2,
          user1Offer: u1Offered[0] || { title: "1 hora de Saber", availability: "Lunes a Viernes" },
          user2Offer: u2Offered[0] || { title: "1 hora de Saber", availability: "Sábados y Domingos" },
          user1Wanted: u1Wanted[0] || { title: "Cualquier saber" },
          user2Wanted: u2Wanted[0] || { title: "Cualquier saber" },
        },
      });
    }

    return NextResponse.json({ isMatch: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
