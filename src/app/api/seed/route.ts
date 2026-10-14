import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
