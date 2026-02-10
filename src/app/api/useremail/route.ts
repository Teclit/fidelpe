import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "useremail.json");

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type EmailPayload = {
  email?: string;
};

const readEmails = async (): Promise<string[]> => {
  try {
    const contents = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as EmailPayload | null;
  const email = payload?.email?.trim() ?? "";
  const normalizedEmail = email.toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const emails = await readEmails();
  const hasEmail = emails.some((storedEmail) => storedEmail.toLowerCase() === normalizedEmail);
  if (!hasEmail) {
    emails.push(email);
    await fs.writeFile(DATA_FILE, `${JSON.stringify(emails, null, 2)}\n`, "utf8");
  }

  return NextResponse.json({ ok: true, stored: !hasEmail });
}
