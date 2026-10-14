import { NextResponse } from "next/server";
import { db } from "@/db";
import { exchanges, users, messages } from "@/db/schema";
import { eq, or, and, sql } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const userIdStr = searchParams.get("userId") || "1";
    const userId = Number(userIdStr);

    const userExchanges = await db
      .select()
      .from(exchanges)
      .where(or(eq(exchanges.user1Id, userId), eq(exchanges.user2Id, userId)));

    // Enrich exchanges with user details
    const enriched = [];
    for (const ex of userExchanges) {
      const partnerId = ex.user1Id === userId ? ex.user2Id : ex.user1Id;
      const [partner] = await db.select().from(users).where(eq(users.id, partnerId));
      const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
      enriched.push({
        ...ex,
        partner,
        currentUser,
        mySkill: ex.user1Id === userId ? ex.user1SkillTitle : ex.user2SkillTitle,
        partnerSkill: ex.user1Id === userId ? ex.user2SkillTitle : ex.user1SkillTitle,
      });
    }

    return NextResponse.json({ exchanges: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      user1Id,
      user2Id,
      user1SkillTitle,
      user2SkillTitle,
      user1Availability,
      user2Availability,
      mode,
      locationOrLink,
      scheduledDate,
      notes,
    } = body;

    const u1Id = Number(user1Id);
    const u2Id = Number(user2Id);

    const [newExchange] = await db
      .insert(exchanges)
      .values({
        user1Id: u1Id,
        user2Id: u2Id,
        user1SkillTitle: user1SkillTitle || "1 hora de Saber",
        user2SkillTitle: user2SkillTitle || "1 hora de Saber",
        user1Availability: user1Availability || "Disponibilidad acordada",
        user2Availability: user2Availability || "Disponibilidad acordada",
        status: "confirmed",
        mode: mode || "presencial",
        locationOrLink: locationOrLink || "Av. Libertador 1230, Buenos Aires",
        scheduledDate: scheduledDate || "Próximo encuentro a coordinar",
        notes: notes || "Intercambio confirmado vía Trueque de Saberes.",
      })
      .returning();

    // Auto-create initial confirmation message in chat
    await db.insert(messages).values({
      exchangeId: newExchange.id,
      senderId: u1Id,
      receiverId: u2Id,
      text: `🎉 ¡Intercambio Confirmado! 🤝 ${user1SkillTitle} ↔️ ${user2SkillTitle}.`,
      proposalData: JSON.stringify(newExchange),
    });

    return NextResponse.json({ exchange: newExchange });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { exchangeId, status } = body;

    const [updated] = await db
      .update(exchanges)
      .set({ status })
      .where(eq(exchanges.id, Number(exchangeId)))
      .returning();

    // If exchange is marked completed, award hours to both participants or transfer 1 hour
    if (status === "completed" && updated) {
      await db
        .update(users)
        .set({ hoursBalance: sql`${users.hoursBalance} + 1` })
        .where(eq(users.id, updated.user1Id));

      await db
        .update(users)
        .set({ hoursBalance: sql`${users.hoursBalance} + 1` })
        .where(eq(users.id, updated.user2Id));
    }

    return NextResponse.json({ exchange: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
