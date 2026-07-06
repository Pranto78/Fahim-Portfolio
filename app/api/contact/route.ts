import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS = 5;
const requests = new Map<string, { count: number; resetAt: number }>();

type ContactBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[
        character
      ] || character
  );
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = requests.get(ip);

  if (!current || current.resetAt <= now) {
    requests.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(clientIp(req))) {
      return NextResponse.json(
        { error: "Too many messages. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as ContactBody;
    const name = clean(body.name, 80);
    const email = clean(body.email, 160).toLowerCase();
    const phone = clean(body.phone, 40);
    const subject = clean(body.subject, 120);
    const message = clean(body.message, 5000);
    const website = clean(body.website, 200);
    const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;

    // Honeypot and minimum-fill-time checks silently accept obvious bots.
    if (website || !startedAt || Date.now() - startedAt < 1500) {
      return NextResponse.json({ sent: true });
    }

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (subject.length < 3) {
      return NextResponse.json({ error: "Please enter a subject." }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: "Please write a slightly longer message." }, { status: 400 });
    }
    if ([name, email, subject].some((value) => /[\r\n]/.test(value))) {
      return NextResponse.json({ error: "Invalid contact details." }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_APP_PASSWORD?.replace(/\s/g, "");
    const contactTo = process.env.CONTACT_TO_EMAIL || smtpUser;

    if (!smtpUser || !smtpPassword || !contactTo) {
      return NextResponse.json({ error: "Email delivery is not configured yet." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPassword },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await transporter.sendMail({
      from: { name: "FSP Portfolio Contact", address: smtpUser },
      to: contactTo,
      replyTo: { name, address: email },
      subject: `[Portfolio] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Subject: ${subject}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
          <h2 style="margin-bottom:16px">New portfolio message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="border:0;border-top:1px solid #dce2ea;margin:20px 0" />
          <p>${safeMessage}</p>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "The message could not be sent. Please try again shortly." },
      { status: 500 }
    );
  }
}
