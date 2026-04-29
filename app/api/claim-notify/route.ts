import { NextRequest, NextResponse } from "next/server";
import { sendBrevoEmail } from "@/utils/brevo";

export async function POST(request: NextRequest) {
  const { listingId, listingName, userEmail, phone, message } = await request.json();

  if (!listingId || !listingName || !userEmail) {
    return NextResponse.json({ error: "listingId, listingName and userEmail are required" }, { status: 400 });
  }

  if (!process.env.BREVO_API_KEY) {
    return NextResponse.json({ skipped: "BREVO_API_KEY not set" });
  }

  const listingUrl = `https://www.moosey.ro/listing/${listingId}`;
  const adminUrl = "https://www.moosey.ro/admin/revendicari";
  const now = new Date().toLocaleDateString("ro-RO", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const adminHtml = `
<table width="100%" cellpadding="0" cellspacing="0"
       style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <tr>
    <td style="background: #ff5a2e; padding: 20px; text-align: center;">
      <span style="color: white; font-size: 24px; font-weight: bold;">Moosey Admin</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 24px; background: #ffffff;">
      <h2 style="color: #2C2C2A; font-size: 20px; margin: 0 0 16px 0;">Cerere nouă de revendicare</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr><td style="padding: 8px 12px; font-weight: bold; color: #555; width: 130px; border-bottom: 1px solid #f0f0f0;">Listing</td><td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;"><a href="${listingUrl}" style="color:#ff5a2e;">${listingName}</a></td></tr>
        <tr style="background:#f9f9f9;"><td style="padding: 8px 12px; font-weight: bold; color: #555; border-bottom: 1px solid #f0f0f0;">Email utilizator</td><td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${userEmail}" style="color:#ff5a2e;">${userEmail}</a></td></tr>
        <tr><td style="padding: 8px 12px; font-weight: bold; color: #555; border-bottom: 1px solid #f0f0f0;">Telefon</td><td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${phone || "necompletat"}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding: 8px 12px; font-weight: bold; color: #555; border-bottom: 1px solid #f0f0f0;">Mesaj</td><td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${message || "—"}</td></tr>
        <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Data</td><td style="padding: 8px 12px;">${now}</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 16px 32px 32px;">
      <a href="${adminUrl}"
         style="background: #ff5a2e; color: white; padding: 14px 28px;
                border-radius: 25px; text-decoration: none;
                font-weight: bold; font-size: 15px; display: inline-block;">
        Aprobă sau respinge →
      </a>
    </td>
  </tr>
  <tr>
    <td style="background: #fff5f3; padding: 16px; text-align: center; border-top: 1px solid #ffe4dc;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        Moosey &middot; <a href="https://www.moosey.ro" style="color: #ff5a2e;">www.moosey.ro</a>
      </p>
    </td>
  </tr>
</table>`;

  const result = await sendBrevoEmail(
    "hello@moosey.ro",
    `[Admin] Cerere revendicare: ${listingName}`,
    adminHtml
  );

  return NextResponse.json({ success: result.ok, status: result.status });
}
