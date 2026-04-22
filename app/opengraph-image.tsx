import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Moosey — Activități și locuri pentru copii";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fff4f0 0%, #fff8f5 60%, #ffffff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, #ff5a2e 2px, transparent 2px)",
            backgroundSize: "40px 40px",
            opacity: 0.06,
          }}
        />
        {/* Blob top-right */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            background: "#ff5a2e",
            borderRadius: "50%",
            opacity: 0.08,
          }}
        />
        {/* Blob bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 240,
            height: 240,
            background: "#ff5a2e",
            borderRadius: "50%",
            opacity: 0.06,
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {/* Badge */}
          <div
            style={{
              background: "#ffe8e0",
              color: "#ff5a2e",
              fontSize: 22,
              fontWeight: 700,
              padding: "10px 28px",
              borderRadius: 50,
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            📍 Sibiu, România
          </div>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: 72 }}>🧡</span>
            <span
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: "#ff5a2e",
                letterSpacing: -2,
              }}
            >
              Moosey
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#1a1a2e",
              textAlign: "center",
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            Activități și locuri pentru copii
          </div>

          {/* Tags row */}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {["🛝 Loc de joacă", "🎨 Cursuri", "🎭 Spectacole", "⚽ Sport"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "white",
                  border: "2px solid #ffe0d6",
                  color: "#555",
                  fontSize: 20,
                  fontWeight: 700,
                  padding: "10px 20px",
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
