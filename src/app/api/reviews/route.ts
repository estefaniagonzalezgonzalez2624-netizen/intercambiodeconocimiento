import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const toUserId = searchParams.get("userId");

    if (toUserId) {
      const userReviews = await db
        .select({
          review: reviews,
          fromUser: users,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.fromUserId, users.id))
        .where(eq(reviews.toUserId, Number(toUserId)));

      return NextResponse.json({ reviews: userReviews });
    }

    const allReviews = await db.select().from(reviews);
    return NextResponse.json({ reviews: allReviews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { exchangeId, fromUserId, toUserId, rating, comment, skillTaught } = body;

    const [newReview] = await db
      .insert(reviews)
      .values({
        exchangeId: exchangeId ? Number(exchangeId) : null,
        fromUserId: Number(fromUserId),
        toUserId: Number(toUserId),
        rating: Number(rating),
        comment: comment || "",
        skillTaught: skillTaught || "Trueque de Saberes",
      })
      .returning();

    // Update recipient total reviews and recalculate average rating
    const toUserReviews = await db.select().from(reviews).where(eq(reviews.toUserId, Number(toUserId)));
    const totalCount = toUserReviews.length;
    const avgRating = toUserReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount;

    await db
      .update(users)
      .set({
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: totalCount,
      })
      .where(eq(users.id, Number(toUserId)));

    return NextResponse.json({ review: newReview });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
