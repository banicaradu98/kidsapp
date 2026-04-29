import { NextRequest, NextResponse } from "next/server";
import { emailTemplate, sendBrevoEmail } from "@/utils/brevo";

export async function POST(request: NextRequest) {
  const { email, name } = await request.json();

  if (!email || !name) {
    return NextResponse.json({ error: "email and name required" }, { status: 400 });
  }

  if (!process.env.BREVO_API_KEY) {
    return NextResponse.json({ error: "No API key configured" }, { status: 500 });
  }

  const html = emailTemplate(
    "Mulțumim! Cererea ta a fost primită 🎉",
    `<p style="color:#5F5E5A;line-height:1.6;margin:0 0 12px 0;">
      Locația <strong>${name}</strong> a fost primită și este acum în curs de verificare.
    </p>
    <p style="color:#5F5E5A;line-height:1.6;margin:0 0 12px 0;">
      Vei primi un alt email când locația ta va fi aprobată și vizibilă pe Moosey.
      De obicei durează maxim <strong>48 de ore</strong>.
    </p>
    <p style="color:#9ca3af;font-size:13px;margin:0;">
      Întrebări? Scrie-ne la
      <a href="mailto:hello@moosey.ro" style="color:#ff5a2e;">hello@moosey.ro</a>
    </p>`,
    "Vizitează Moosey →",
    "https://www.moosey.ro"
  );

  const result = await sendBrevoEmail(
    email,
    `Locația ta "${name}" a fost primită! ⏳`,
    html
  );

  if (!result.ok) {
    console.error("[send-confirmation] Brevo error:", result.result);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
