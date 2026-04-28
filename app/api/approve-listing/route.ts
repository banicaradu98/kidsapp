import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";

export async function POST(request: NextRequest) {
  // Verify admin session cookie
  const adminSession = request.cookies.get("admin_session");
  if (!adminSession?.value || adminSession.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await request.json();
  if (!listingId) {
    return NextResponse.json({ error: "listingId is required" }, { status: 400 });
  }

  // Fetch listing details
  const { data: listing } = await adminClient
    .from("listings")
    .select("id, name, contact_email")
    .eq("id", listingId)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Approve listing
  const { error } = await adminClient
    .from("listings")
    .update({ is_verified: true })
    .eq("id", listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send emails via Brevo
  if (process.env.BREVO_API_KEY) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosey.ro";
    const listingUrl = `${siteUrl}/listing/${listing.id}`;
    const listingName = listing.name ?? "Locația ta";

    const sendBrevo = (to: string, subject: string, htmlContent: string) =>
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Moosey", email: "hello@moosey.ro" },
          to: [{ email: to }],
          subject,
          htmlContent,
        }),
      });

    const ownerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#ff5a2e;padding:32px;text-align:center;border-radius:12px 12px 0 0;">
          <img src="https://www.moosey.ro/images/logo-moosey.png" alt="Moosey" style="height:50px;" />
        </div>
        <div style="padding:32px;background:#fff;">
          <h2 style="color:#1a1a2e;margin-top:0;">Locația ta este acum live! 🎉</h2>
          <p style="color:#5F5E5A;line-height:1.6;">
            <strong>${listingName}</strong> a fost verificată și este acum vizibilă
            pentru familiile din Sibiu pe Moosey.
          </p>
          <p style="color:#5F5E5A;line-height:1.6;">
            Vrei să o gestionezi direct? Creează un cont cu această adresă de email,
            apoi apasă butonul <em>"Revendică această locație"</em> de pe pagina locației.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${listingUrl}"
               style="background:#ff5a2e;color:#fff;padding:14px 28px;border-radius:50px;
                      text-decoration:none;font-weight:bold;">
              Vezi locația pe Moosey →
            </a>
          </div>
        </div>
        <div style="background:#fff5f3;padding:20px;text-align:center;
                    border-radius:0 0 12px 12px;border-top:1px solid #ffe4dc;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            Moosey ·
            <a href="https://www.moosey.ro" style="color:#ff5a2e;">www.moosey.ro</a>
            · hello@moosey.ro
          </p>
        </div>
      </div>`;

    const adminHtml = `
      <p>Locația <strong>${listingName}</strong> a fost aprobată și este acum live.</p>
      <p>Email contact: ${listing.contact_email
        ? `<a href="mailto:${listing.contact_email}">${listing.contact_email}</a>`
        : "necompletat"
      }</p>
      <p>Link: <a href="${listingUrl}">${listingUrl}</a></p>
      <p>Verifică dacă utilizatorul a creat cont și a revendicat locația.</p>`;

    const emails: Promise<Response>[] = [
      sendBrevo(
        "hello@moosey.ro",
        `[Admin] Locație aprobată: ${listingName}`,
        adminHtml
      ),
    ];

    if (listing.contact_email) {
      emails.push(
        sendBrevo(
          listing.contact_email,
          `Locația ta "${listingName}" este acum live pe Moosey! 🎉`,
          ownerHtml
        )
      );
    }

    await Promise.allSettled(emails);
  }

  return NextResponse.json({ success: true });
}
