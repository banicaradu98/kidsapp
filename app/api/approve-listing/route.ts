import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";
import { emailTemplate, sendBrevoEmail } from "@/utils/brevo";

export async function POST(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session");
  if (!adminSession?.value || adminSession.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await request.json();
  if (!listingId) {
    return NextResponse.json({ error: "listingId is required" }, { status: 400 });
  }

  console.log("[approve-listing] BREVO_API_KEY length:", process.env.BREVO_API_KEY?.length);
  console.log("[approve-listing] BREVO_API_KEY prefix:", process.env.BREVO_API_KEY?.substring(0, 10));

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

  const { error: updateError } = await adminClient
    .from("listings")
    .update({ is_verified: true })
    .eq("id", listingId);

  if (updateError) {
    console.error("[approve-listing] Supabase update error:", updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const listingUrl = `https://www.moosey.ro/listing/${listing.id}`;
  const listingName = listing.name ?? "Locația ta";
  const emailResults: Record<string, unknown> = {};

  // Email admin
  const adminHtml = emailTemplate(
    "Locație aprobată",
    `<p style="color:#5F5E5A;line-height:1.6;margin:0 0 12px 0;">
      Locația <strong>${listingName}</strong> a fost aprobată și este acum live.
    </p>
    <p style="color:#5F5E5A;line-height:1.6;margin:0 0 8px 0;">
      <strong>Email contact:</strong> ${listing.contact_email ?? "necompletat"}
    </p>
    <p style="color:#5F5E5A;line-height:1.6;margin:0;">
      <strong>Link:</strong>
      <a href="${listingUrl}" style="color:#ff5a2e;">${listingUrl}</a>
    </p>`,
    "Deschide în admin →",
    "https://www.moosey.ro/admin/aprobare"
  );
  emailResults.admin = await sendBrevoEmail(
    "hello@moosey.ro",
    `[Admin] Locație aprobată: ${listingName}`,
    adminHtml
  );

  // Email organizator
  if (listing.contact_email) {
    const ownerHtml = emailTemplate(
      "Locația ta este acum live! 🎉",
      `<p style="color:#5F5E5A;line-height:1.6;margin:0 0 12px 0;">
        <strong>${listingName}</strong> a fost verificată și este acum vizibilă
        pentru familiile din Sibiu pe Moosey.
      </p>
      <p style="color:#5F5E5A;line-height:1.6;margin:0 0 8px 0;">
        Vrei să o gestionezi direct? Urmează pașii de mai jos:
      </p>
      <ol style="color:#5F5E5A;line-height:1.8;margin:0;padding-left:20px;">
        <li>Creează un cont gratuit pe Moosey cu <strong>această adresă de email</strong></li>
        <li>Accesează pagina locației tale</li>
        <li>Apasă butonul <strong>&ldquo;Revendică această locație&rdquo;</strong></li>
        <li>Vei primi acces la dashboard-ul de organizator</li>
      </ol>`,
      "Vezi locația pe Moosey →",
      listingUrl
    );
    const ownerResult = await sendBrevoEmail(
      listing.contact_email,
      `Locația ta "${listingName}" este acum live pe Moosey! 🎉`,
      ownerHtml
    );
    if (!ownerResult.ok) {
      console.error("[approve-listing] Email owner FAILED:", JSON.stringify(ownerResult.result));
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
