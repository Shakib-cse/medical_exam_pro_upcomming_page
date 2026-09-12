import { NextResponse } from "next/server";
import { getAllEarlyAccessLeadsFromNeon, getEarlyAccessCountFromNeon } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = await getAllEarlyAccessLeadsFromNeon();
    const total = await getEarlyAccessCountFromNeon();

    return NextResponse.json({
      success: true,
      total,
      leads,
    });
  } catch (error) {
    console.error("Failed to fetch leads list:", error);
    return NextResponse.json(
      { success: false, message: "Database query error." },
      { status: 500 }
    );
  }
}
