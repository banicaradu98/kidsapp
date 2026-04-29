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

  // TASK 3 — verifică disponibilitatea cheii Brevo
  console.log("[approve-listing] BREVO_API_KEY length:", process.env.BREVO_API_KEY?.length);
  console.log("[approve-listing] BREVO_API_KEY prefix:", process.env.BREVO_API_KEY?.substring(0, 10));

  // TASK 1 — fetch listing cu logging fetch error
  const { data: listing, error: fetchError } = await adminClient
    .from("listings")
    .select("id, name, contact_email")
    .eq("id", listingId)
    .single();

  console.log("[approve-listing] Listing fetched:", JSON.stringify(listing));
  console.log("[approve-listing] Fetch error:", fetchError);
  console.log("[approve-listing] Contact email:", listing?.contact_email);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found", fetchError }, { status: 404 });
  }

  // Approve listing
  const { error: updateError } = await adminClient
    .from("listings")
    .update({ is_verified: true })
    .eq("id", listingId);

  if (updateError) {
    console.error("[approve-listing] Supabase update error:", updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const emailResults: Record<string, unknown> = {};

  if (!process.env.BREVO_API_KEY) {
    console.warn("[approve-listing] BREVO_API_KEY not set — skipping emails");
    emailResults.skipped = "BREVO_API_KEY not set";
    return NextResponse.json({ success: true, emails: emailResults });
  }

  const listingUrl = `https://www.moosey.ro/listing/${listing.id}`;
  const listingName = listing.name ?? "Locația ta";

  const sendBrevo = async (to: string, subject: string, htmlContent: string) => {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
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
    const result = await res.json();
    console.log(`[approve-listing] Brevo → ${to} | status: ${res.status} | body:`, JSON.stringify(result));
    return { status: res.status, ok: res.ok, result };
  };

  // Email admin
  const adminHtml = `
    <p>Locația <strong>${listingName}</strong> a fost aprobată și este acum live.</p>
    <p>Email contact: ${listing.contact_email
      ? `<a href="mailto:${listing.contact_email}">${listing.contact_email}</a>`
      : "necompletat"
    }</p>
    <p>Link: <a href="${listingUrl}">${listingUrl}</a></p>
    <p>Verifică dacă utilizatorul a creat cont și a revendicat locația.</p>`;

  emailResults.admin = await sendBrevo(
    "hello@moosey.ro",
    `[Admin] Locație aprobată: ${listingName}`,
    adminHtml
  );

  // TASK 2 — email organizator, separat și explicit
  if (listing.contact_email) {
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff5a2e; padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
          <img src="https://www.moosey.ro/images/logo-moosey.png"
               alt="Moosey" style="height: 50px;" />
        </div>
        <div style="padding: 32px; background: #fff;">
          <h2 style="color: #2C2C2A;">Locația ta este acum live! 🎉</h2>
          <p style="color: #5F5E5A; line-height: 1.6;">
            <strong>${listingName}</strong> a fost verificată și este
            acum vizibilă pentru familiile din Sibiu pe Moosey.
          </p>
          <p style="color: #5F5E5A; line-height: 1.6;">
            Vrei să o gestionezi direct? Urmează pașii de mai jos:
          </p>
          <ol style="color: #5F5E5A; line-height: 1.8;">
            <li>Creează un cont gratuit pe Moosey cu această adresă de email</li>
            <li>Accesează pagina locației tale</li>
            <li>Apasă butonul <strong>"Revendică această locație"</strong></li>
            <li>Vei primi acces la dashboard-ul de organizator</li>
          </ol>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${listingUrl}"
               style="background: #ff5a2e; color: white; padding: 14px 28px;
                      border-radius: 50px; text-decoration: none; font-weight: bold;
                      display: inline-block;">
              Vezi locația pe Moosey →
            </a>
          </div>
        </div>
        <div style="background: #fff5f3; padding: 20px; text-align: center;
                    border-radius: 0 0 12px 12px; border-top: 1px solid #ffe4dc;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Moosey ·
            <a href="https://www.moosey.ro" style="color: #ff5a2e;">www.moosey.ro</a>
            · hello@moosey.ro
          </p>
        </div>
      </div>`;

    const ownerResult = await sendBrevo(
      listing.contact_email,
      `Locația ta "${listingName}" este acum live pe Moosey! 🎉`,
      ownerHtml
    );

    if (!ownerResult.ok) {
      console.error("[approve-listing] Brevo email FAILED:", JSON.stringify(ownerResult.result));
    } else {
      console.log("[approve-listing] Email trimis cu succes la:", listing.contact_email);
    }

    emailResults.owner = ownerResult;
    emailResults.ownerEmailFound = true;
  } else {
    console.log("[approve-listing] Nu există contact_email pentru listing-ul:", listingId);
    emailResults.ownerEmailFound = false;
  }

  return NextResponse.json({ success: true, emails: emailResults });
}
