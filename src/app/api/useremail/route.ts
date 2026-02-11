import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const DEFAULT_DATA_FILE = process.env.VERCEL
  ? path.join("/tmp", "useremail.json")
  : path.join(process.cwd(), "src", "data", "useremail.json");
const DATA_FILE = process.env.EMAIL_DATA_PATH?.trim() || DEFAULT_DATA_FILE;

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const parseRequestBody = async (request: Request): Promise<unknown | null> => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const getEmailFromPayload = (payload: unknown): string => {
  if (!payload || typeof payload !== "object") {
    return "";
  }
  const record = payload as Record<string, unknown>;
  return typeof record.email === "string" ? record.email : "";
};

const ensureDataDir = async (): Promise<void> => {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
};

const readEmails = async (): Promise<string[]> => {
  try {
    const contents = await fs.readFile(DATA_FILE, "utf8");
    const parsed = parseJson(contents);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed;
    }
    return [];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    const payload = await parseRequestBody(request);
    const email = getEmailFromPayload(payload).trim();
    const normalizedEmail = email.toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const emails = await readEmails();
    const hasEmail = emails.some((storedEmail) => storedEmail.toLowerCase() === normalizedEmail);
    if (!hasEmail) {
      emails.push(email);
      await ensureDataDir();
      await fs.writeFile(DATA_FILE, `${JSON.stringify(emails, null, 2)}\n`, "utf8");
    }

    return NextResponse.json({ ok: true, stored: !hasEmail });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to store email.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
