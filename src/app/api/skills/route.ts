import { NextResponse } from "next/server";
import { db } from "@/db";
import { skillsOffered, skillsWanted, users } from "@/db/schema";
import { eq, like, or, and, ne } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const mode = searchParams.get("mode");
    const query = searchParams.get("q");
    const excludeUserId = searchParams.get("excludeUserId");

    let allOffered = await db
      .select({
        skill: skillsOffered,
        user: users,
      })
      .from(skillsOffered)
      .innerJoin(users, eq(skillsOffered.userId, users.id));

    if (excludeUserId) {
      allOffered = allOffered.filter(item => item.user.id !== Number(excludeUserId));
    }

    if (category && category !== "all") {
      allOffered = allOffered.filter(item => item.skill.category === category);
    }

    if (mode && mode !== "all") {
      allOffered = allOffered.filter(item => item.skill.mode === mode || item.skill.mode === "ambos");
    }

    if (query) {
      const qLower = query.toLowerCase();
      allOffered = allOffered.filter(
        item =>
          item.skill.title.toLowerCase().includes(qLower) ||
          (item.skill.description && item.skill.description.toLowerCase().includes(qLower)) ||
          item.user.name.toLowerCase().includes(qLower) ||
          item.user.city.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({ skills: allOffered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, userId, title, category, description, durationHours, availability, mode, level } = body;

    if (type === "wanted") {
      const [newWanted] = await db
        .insert(skillsWanted)
        .values({
          userId: Number(userId),
          title,
          category: category || "general",
        })
        .returning();
      return NextResponse.json({ skill: newWanted, type: "wanted" });
    }

    const [newOffered] = await db
      .insert(skillsOffered)
      .values({
        userId: Number(userId),
        title,
        category,
        description: description || "",
        durationHours: durationHours || 1,
        availability: availability || "A convenir",
        mode: mode || "ambos",
        level: level || "Intermedio",
      })
      .returning();

    return NextResponse.json({ skill: newOffered, type: "offered" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
