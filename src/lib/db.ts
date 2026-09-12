import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

function resolveDatabaseUrl(): string {
  let url = "";

  // 1. Check local .env.local file first (ensures immediate updates)
  const envLocalPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, "utf8");
    const unpooledMatch = content.match(/^DATABASE_URL_UNPOOLED=(.+)$/m);
    const pooledMatch = content.match(/^DATABASE_URL=(.+)$/m);
    if (unpooledMatch) {
      url = unpooledMatch[1].replace(/["']/g, "").trim();
    } else if (pooledMatch) {
      url = pooledMatch[1].replace(/["']/g, "").trim();
    }
  }

  // 2. Fallback to process.env
  if (!url) {
    url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";
  }

  // 3. Fallback to kawan-backend/.env
  if (!url) {
    const backendEnvPath = path.join(process.cwd(), "..", "kawan-backend", ".env");
    if (fs.existsSync(backendEnvPath)) {
      const content = fs.readFileSync(backendEnvPath, "utf8");
      const match = content.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
        url = match[1].replace(/["']/g, "").trim();
      }
    }
  }

  // Neon HTTP driver connects directly via HTTPS to the unpooled direct endpoint
  if (url.includes("-pooler")) {
    url = url.replace("-pooler", "");
  }

  return url;
}

const dbUrl = resolveDatabaseUrl();
export const sql = dbUrl ? neon(dbUrl) : null;

export interface EarlyAccessLeadRecord {
  id?: string;
  vip_id: string;
  name: string;
  email: string;
  specialty: string;
  stage: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Inserts or updates an early access applicant directly in Neon PostgreSQL.
 */
export async function saveLeadToNeon(lead: {
  vipId: string;
  name: string;
  email: string;
  specialty: string;
  stage: string;
}): Promise<EarlyAccessLeadRecord> {
  if (!sql) {
    throw new Error("Neon database connection string could not be resolved.");
  }

  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS early_access_leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vip_id VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      specialty VARCHAR(255) NOT NULL,
      stage VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Upsert lead
  const result = await sql`
    INSERT INTO early_access_leads (vip_id, name, email, specialty, stage, updated_at)
    VALUES (${lead.vipId}, ${lead.name}, ${lead.email.toLowerCase().trim()}, ${lead.specialty}, ${lead.stage}, NOW())
    ON CONFLICT (email) 
    DO UPDATE SET 
      vip_id = EXCLUDED.vip_id,
      name = EXCLUDED.name,
      specialty = EXCLUDED.specialty,
      stage = EXCLUDED.stage,
      updated_at = NOW()
    RETURNING id, vip_id, name, email, specialty, stage, created_at, updated_at;
  `;

  return result[0] as EarlyAccessLeadRecord;
}

/**
 * Returns total count of early access signups directly from Neon DB.
 */
export async function getEarlyAccessCountFromNeon(): Promise<number> {
  if (!sql) return 0;
  try {
    const result = await sql`SELECT COUNT(*)::int as count FROM early_access_leads;`;
    return Number(result[0]?.count ?? 0);
  } catch (err) {
    console.error("[Neon DB] Error fetching count:", err);
    return 0;
  }
}

/**
 * Retrieves all early access signups from Neon DB.
 */
export async function getAllEarlyAccessLeadsFromNeon(): Promise<EarlyAccessLeadRecord[]> {
  if (!sql) return [];
  try {
    const result = await sql`
      SELECT id, vip_id, name, email, specialty, stage, created_at, updated_at 
      FROM early_access_leads 
      ORDER BY created_at DESC;
    `;
    return result as EarlyAccessLeadRecord[];
  } catch (err) {
    console.error("[Neon DB] Error fetching leads:", err);
    return [];
  }
}
