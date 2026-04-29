export function emailTemplate(
  title: string,
  content: string,
  buttonText?: string,
  buttonUrl?: string
): string {
  const buttonRow = buttonText && buttonUrl ? `
  <tr>
    <td style="text-align: center; padding: 16px 32px 32px;">
      <a href="${buttonUrl}"
         style="background: #ff5a2e; color: white; padding: 14px 28px;
                border-radius: 25px; text-decoration: none;
                font-weight: bold; font-size: 15px; display: inline-block;">
        ${buttonText}
      </a>
    </td>
  </tr>` : "";

  return `
<table width="100%" cellpadding="0" cellspacing="0"
       style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <tr>
    <td style="background: #ff5a2e; padding: 24px; text-align: center;">
      <span style="color: white; font-size: 28px; font-weight: bold;">Moosey</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 32px; background: #ffffff;">
      <h2 style="color: #2C2C2A; font-size: 22px; margin: 0 0 16px 0;">
        ${title}
      </h2>
      ${content}
    </td>
  </tr>
  ${buttonRow}
  <tr>
    <td style="background: #fff5f3; padding: 16px; text-align: center;
               border-top: 1px solid #ffe4dc;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        Moosey &middot;
        <a href="https://www.moosey.ro" style="color: #ff5a2e;">www.moosey.ro</a>
        &middot; hello@moosey.ro
      </p>
    </td>
  </tr>
</table>`;
}

export async function sendBrevoEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ ok: boolean; status: number; result: unknown }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[brevo] BREVO_API_KEY not set");
    return { ok: false, status: 0, result: { error: "BREVO_API_KEY not set" } };
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Moosey", email: "hello@moosey.ro" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  const result = await res.json().catch(() => ({}));
  console.log(`[brevo] → ${to} | status: ${res.status} | ${JSON.stringify(result)}`);
  return { ok: res.ok, status: res.status, result };
}
