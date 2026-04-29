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

  console.log("[approve-listing] Approving listing:", listingId);
  console.log("[approve-listing] BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);

  // Fetch listing details
  const { data: listing } = await adminClient
    .from("listings")
    .select("id, name, contact_email")
    .eq("id", listingId)
    .single();

  console.log("[approve-listing] Listing data:", JSON.stringify(listing));

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  console.log("[approve-listing] Contact email:", listing.contact_email);

  // Approve listing
  const { error } = await adminClient
    .from("listings")
    .update({ is_verified: true })
    .eq("id", listingId);

  if (error) {
    console.error("[approve-listing] Supabase update error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send emails via Brevo
  const emailResults: Record<string, unknown> = {};

  if (process.env.BREVO_API_KEY) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosey.ro";
    const listingUrl = `${siteUrl}/listing/${listing.id}`;
    const listingName = listing.name ?? "Locația ta";

    const sendBrevo = async (to: string, subject: string, htmlContent: string) => {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
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
      const result = await response.json();
      console.log(`[approve-listing] Brevo → ${to} | status: ${response.status} | body:`, JSON.stringify(result));
      return { status: response.status, result };
    };

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
          <div style="text-align:center;margin:28px 0;">
            <a href="${listingUrl}"
               style="background:#ff5a2e;color:#fff;padding:14px 28px;border-radius:50px;
                      text-decoration:none;font-weight:bold;display:inline-block;">
              Vezi locația pe Moosey →
            </a>
          </div>
          <div style="background:#fff5f3;border:1px solid #ffe4dc;border-radius:12px;padding:20px;margin-top:8px;">
            <p style="color:#1a1a2e;font-weight:bold;margin:0 0 8px;">Vrei să îți gestionezi locația?</p>
            <ol style="color:#5F5E5A;line-height:1.8;margin:0;padding-left:20px;">
              <li>Creează un cont cu <strong>această adresă de email</strong> pe
                <a href="https://www.moosey.ro" style="color:#ff5a2e;">www.moosey.ro</a>
              </li>
              <li>Mergi la pagina ta:
                <a href="${listingUrl}" style="color:#ff5a2e;">${listingUrl}</a>
              </li>
              <li>Apasă butonul <strong>&ldquo;Revendică această locație&rdquo;</strong></li>
            </ol>
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

    const [adminResult, ownerResult] = await Promise.allSettled([
      sendBrevo("hello@moosey.ro", `[Admin] Locație aprobată: ${listingName}`, adminHtml),
      listing.contact_email
        ? sendBrevo(
            listing.contact_email,
            `Locația ta "${listingName}" este acum live pe Moosey! 🎉`,
            ownerHtml
          )
        : Promise.resolve(null),
    ]);

    emailResults.admin = adminResult.status === "fulfilled" ? adminResult.value : { error: (adminResult as PromiseRejectedResult).reason };
    emailResults.owner = ownerResult.status === "fulfilled" ? ownerResult.value : { error: (ownerResult as PromiseRejectedResult).reason };
    emailResults.ownerEmailFound = !!listing.contact_email;
  } else {
    console.warn("[approve-listing] BREVO_API_KEY not set — skipping emails");
    emailResults.skipped = "BREVO_API_KEY not set";
  }

  return NextResponse.json({ success: true, emails: emailResults });
}
