import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const PROJECT_DATA_FILE = path.join(process.cwd(), "src", "data", "useremail.json");
const FALLBACK_DATA_FILE = path.join("/tmp", "useremail.json");
let dataFile = process.env.EMAIL_DATA_PATH?.trim() || PROJECT_DATA_FILE;

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type EmailRecord = {
  email: string;
  createdAt: string;
};

type ReadResult = {
  emails: EmailRecord[];
  needsWrite: boolean;
};

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

const getDataFile = (): string => dataFile;

const toIsoDate = (value: unknown, fallback: string): string => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return new Date(parsed).toISOString();
};

const toRecord = (
  value: unknown
): { record: EmailRecord | null; needsNormalization: boolean } => {
  if (typeof value === "string") {
    const email = value.trim();
    if (!isValidEmail(email)) {
      return { record: null, needsNormalization: true };
    }
    return {
      record: { email, createdAt: new Date().toISOString() },
      needsNormalization: true,
    };
  }

  if (!value || typeof value !== "object") {
    return { record: null, needsNormalization: true };
  }

  const record = value as Record<string, unknown>;
  if (typeof record.email !== "string") {
    return { record: null, needsNormalization: true };
  }

  const email = record.email.trim();
  if (!isValidEmail(email)) {
    return { record: null, needsNormalization: true };
  }

  const fallback = new Date().toISOString();
  const createdAt = toIsoDate(record.createdAt, fallback);
  const normalizedEmail = record.email !== email;
  const normalizedDate = record.createdAt !== createdAt;

  return {
    record: {
      email,
      createdAt,
    },
    needsNormalization: normalizedEmail || normalizedDate,
  };
};

const ensureDataDir = async (filePath: string): Promise<void> => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
};

const readEmails = async (): Promise<ReadResult> => {
  try {
    const contents = await fs.readFile(getDataFile(), "utf8");
    const parsed = parseJson(contents);
    if (!Array.isArray(parsed)) {
      return { emails: [], needsWrite: false };
    }

    const seen = new Set<string>();
    const records: EmailRecord[] = [];
    let needsWrite = false;

    parsed.forEach((item) => {
      const { record, needsNormalization } = toRecord(item);
      needsWrite = needsWrite || needsNormalization;
      if (!record) {
        return;
      }

      const normalized = record.email.toLowerCase();
      if (seen.has(normalized)) {
        needsWrite = true;
        return;
      }

      seen.add(normalized);
      records.push(record);
    });

    if (records.length !== parsed.length) {
      needsWrite = true;
    }

    return { emails: records, needsWrite };
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return { emails: [], needsWrite: false };
    }
    throw error;
  }
};

const writeEmails = async (emails: EmailRecord[]): Promise<void> => {
  const payload = `${JSON.stringify(emails, null, 2)}\n`;
  const currentFile = getDataFile();

  try {
    await ensureDataDir(currentFile);
    await fs.writeFile(currentFile, payload, "utf8");
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    const canFallback =
      !process.env.EMAIL_DATA_PATH &&
      currentFile === PROJECT_DATA_FILE &&
      (err.code === "EROFS" || err.code === "EPERM");

    if (!canFallback) {
      throw error;
    }

    dataFile = FALLBACK_DATA_FILE;
    await ensureDataDir(dataFile);
    await fs.writeFile(dataFile, payload, "utf8");
  }
};

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export async function POST(request: Request) {
  try {
    const payload = await parseRequestBody(request);
    const email = getEmailFromPayload(payload).trim();
    const normalizedEmail = email.toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const { emails, needsWrite } = await readEmails();
    if (needsWrite) {
      await writeEmails(emails);
    }

    const existing = emails.find(
      (storedEmail) => storedEmail.email.toLowerCase() === normalizedEmail
    );
    if (existing) {
      return NextResponse.json({ ok: true, stored: false, email: existing });
    }

    const entry: EmailRecord = {
      email,
      createdAt: new Date().toISOString(),
    };

    emails.push(entry);
    await writeEmails(emails);

    return NextResponse.json({ ok: true, stored: true, email: entry });
  } catch (error) {
    return NextResponse.json(
      { error: errorMessage(error, "Failed to store email.") },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { emails, needsWrite } = await readEmails();
    if (needsWrite) {
      await writeEmails(emails);
    }

    return NextResponse.json({
      ok: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    return NextResponse.json(
      { error: errorMessage(error, "Failed to read stored emails.") },
      { status: 500 }
    );
  }
}
