import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, name } = await request.json();

  if (!email || !name) {
    return NextResponse.json({ error: "email and name required" }, { status: 400 });
  }

  if (!process.env.BREVO_API_KEY) {
    return NextResponse.json({ error: "No API key configured" }, { status: 500 });
  }

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#ff5a2e;padding:32px;text-align:center;border-radius:12px 12px 0 0;">
        <img src="https://www.moosey.ro/images/logo-moosey.png" alt="Moosey" style="height:50px;" />
      </div>
      <div style="padding:32px;background:#fff;">
        <h2 style="color:#1a1a2e;margin-top:0;">Mulțumim! 🎉</h2>
        <p style="color:#5F5E5A;line-height:1.6;">
          Locația <strong>${name}</strong> a fost primită și este acum în curs de verificare.
        </p>
        <p style="color:#5F5E5A;line-height:1.6;">
          Vei primi un alt email când locația ta va fi aprobată și vizibilă pe Moosey.
          De obicei durează maxim <strong>48 de ore</strong>.
        </p>
        <p style="color:#9ca3af;font-size:13px;margin-top:24px;">
          Întrebări? Scrie-ne la
          <a href="mailto:hello@moosey.ro" style="color:#ff5a2e;">hello@moosey.ro</a>
        </p>
      </div>
      <div style="background:#fff5f3;padding:20px;text-align:center;
                  border-radius:0 0 12px 12px;border-top:1px solid #ffe4dc;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          Moosey ·
          <a href="https://www.moosey.ro" style="color:#ff5a2e;">www.moosey.ro</a>
        </p>
      </div>
    </div>`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Moosey", email: "hello@moosey.ro" },
      to: [{ email }],
      subject: `Locația ta "${name}" a fost primită! ⏳`,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[send-confirmation] Brevo error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
