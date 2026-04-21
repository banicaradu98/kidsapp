/** @type {import('next').NextConfig} */

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : "*.supabase.co";

const securityHeaders = [
  // Prevent the site from being embedded in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer information sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Basic XSS protection (legacy browsers)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // DNS prefetch control
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy
  // Note: 'unsafe-inline' for scripts is required by Next.js runtime inline hydration.
  // Tighten with nonces in future if needed.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: blob: https://${supabaseHost} https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com https://www.teatrulgong.ro https://teatrulgong.ro`,
      "frame-src https://maps.google.com https://www.google.com https://accounts.google.com",
      `connect-src 'self' https://${supabaseHost} https://*.supabase.co https://*.supabase.io wss://${supabaseHost}`,
      "form-action 'self' https://accounts.google.com",
    ].join("; "),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      // Google profile photos (OAuth avatar)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      // Supabase Storage (listing images + custom avatars)
      { protocol: "https", hostname: "isritlsmzejsxrygflih.supabase.co" },
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [{ protocol: "https", hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname }]
        : [{ protocol: "https", hostname: "*.supabase.co" }]
      ),
      // Teatrul Gong — imagini scraped
      { protocol: "https", hostname: "www.teatrulgong.ro" },
      { protocol: "https", hostname: "teatrulgong.ro" },
    ],
  },
};

export default nextConfig;
