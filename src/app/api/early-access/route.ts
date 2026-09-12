import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  saveLeadToNeon,
  getEarlyAccessCountFromNeon,
  getAllEarlyAccessLeadsFromNeon,
} from "@/lib/db";

interface EarlyAccessPayload {
  name: string;
  email: string;
  specialty: string;
  stage: string;
  vipId: string;
  joinedAt?: string;
}

// Local storage backup directory: upcomming-page/data/
const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_JSON_PATH = path.join(DATA_DIR, "early-access-leads.json");
const LEADS_CSV_PATH = path.join(DATA_DIR, "early-access-leads.csv");

async function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(LEADS_CSV_PATH)) {
    const csvHeader = "Timestamp,VIP ID,Doctor Name,Email,Specialty,Career Stage\n";
    await fs.promises.writeFile(LEADS_CSV_PATH, csvHeader, "utf8");
  }
}

async function saveLeadLocally(payload: EarlyAccessPayload) {
  try {
    await ensureDataDirectory();
    const timestamp = new Date().toISOString();

    // Append to CSV
    const csvRow = `"${timestamp}","${payload.vipId}","${payload.name.replace(/"/g, '""')}","${payload.email.replace(/"/g, '""')}","${payload.specialty.replace(/"/g, '""')}","${payload.stage.replace(/"/g, '""')}"\n`;
    await fs.promises.appendFile(LEADS_CSV_PATH, csvRow, "utf8");

    // Append to JSON list
    let leads: Array<EarlyAccessPayload & { timestamp: string }> = [];
    if (fs.existsSync(LEADS_JSON_PATH)) {
      try {
        const raw = await fs.promises.readFile(LEADS_JSON_PATH, "utf8");
        leads = JSON.parse(raw);
      } catch {
        leads = [];
      }
    }

    leads.push({ ...payload, timestamp });
    await fs.promises.writeFile(LEADS_JSON_PATH, JSON.stringify(leads, null, 2), "utf8");
  } catch (err) {
    console.error("[EarlyAccess] Failed to write local backup:", err);
  }
}

async function forwardToGoogleSheets(payload: EarlyAccessPayload) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return { forwarded: false, reason: "No webhook URL" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        vipId: payload.vipId,
        name: payload.name,
        email: payload.email,
        specialty: payload.specialty,
        stage: payload.stage,
      }),
      redirect: "follow",
    });

    return { forwarded: res.ok, status: res.status };
  } catch (err) {
    return { forwarded: false, error: String(err) };
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EarlyAccessPayload;

    if (!body || !body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required." },
        { status: 400 }
      );
    }

    // Clean up input
    const cleanPayload: EarlyAccessPayload = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      specialty: body.specialty || "General Practice (GP)",
      stage: body.stage || "Foundation Doctor (FY1/FY2)",
      vipId: body.vipId || `KMEP-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedAt: body.joinedAt || new Date().toISOString(),
    };

    // 1. PRIMARY STORAGE: Save directly into Neon PostgreSQL Database
    let neonSaved = false;
    let neonError: string | null = null;
    try {
      await saveLeadToNeon({
        vipId: cleanPayload.vipId,
        name: cleanPayload.name,
        email: cleanPayload.email,
        specialty: cleanPayload.specialty,
        stage: cleanPayload.stage,
      });
      neonSaved = true;
    } catch (dbErr: unknown) {
      const errMessage = dbErr instanceof Error ? `${dbErr.name}: ${dbErr.message}` : String(dbErr);
      console.error("[EarlyAccess] Neon DB Save Error:", dbErr);
      neonError = errMessage;
    }

    // 2. SECONDARY STORAGE: Server-side file backup
    await saveLeadLocally(cleanPayload);

    // 3. OPTIONAL SYNC: Forward to Google Sheets if configured
    const sheetResult = await forwardToGoogleSheets(cleanPayload);

    return NextResponse.json({
      success: true,
      message: "VIP Early Access registration recorded successfully.",
      vipId: cleanPayload.vipId,
      neonDbStored: neonSaved,
      neonError: neonError,
      googleSheetSync: sheetResult.forwarded,
    });
  } catch (error) {
    console.error("[EarlyAccess] Submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    // CSV Export option from Neon DB
    if (format === "csv") {
      const records = await getAllEarlyAccessLeadsFromNeon();

      let csv = "Timestamp,VIP ID,Doctor Name,Email,Specialty,Career Stage\n";
      for (const r of records) {
        csv += `"${r.created_at}","${r.vip_id}","${(r.name || "").replace(/"/g, '""')}","${(r.email || "").replace(/"/g, '""')}","${(r.specialty || "").replace(/"/g, '""')}","${(r.stage || "").replace(/"/g, '""')}"\n`;
      }

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="kmep-early-access-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Standard JSON Status & Stats
    const totalNeon = await getEarlyAccessCountFromNeon();

    return NextResponse.json({
      status: "online",
      targetExam: "UK MSRA 2026",
      launchDate: "15 October 2026",
      database: "Neon PostgreSQL",
      totalRegistrations: totalNeon,
      table: "early_access_leads",
      downloadCsvUrl: "/api/early-access?format=csv",
    });
  } catch (err) {
    return NextResponse.json({ status: "error", error: String(err) }, { status: 500 });
  }
}
