import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, skillsOffered, skillsWanted } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const userList = await db.select().from(users).where(eq(users.id, Number(id)));
      if (userList.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const user = userList[0];
      const offered = await db.select().from(skillsOffered).where(eq(skillsOffered.userId, user.id));
      const wanted = await db.select().from(skillsWanted).where(eq(skillsWanted.userId, user.id));
      return NextResponse.json({ user, skillsOffered: offered, skillsWanted: wanted });
    }

    const allUsers = await db.select().from(users);
    return NextResponse.json({ users: allUsers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, avatar, bio, city, address, age } = body;

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
        bio: bio || "",
        city: city || "Buenos Aires",
        address: address || "",
        age: age || 25,
        rating: 5.0,
        hoursBalance: 3,
        verified: true,
      })
      .returning();

    return NextResponse.json({ user: newUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
