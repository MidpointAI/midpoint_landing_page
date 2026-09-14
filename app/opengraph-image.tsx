import { ImageResponse } from "next/og";

export const alt = "Midpoint - Insurance verification for builders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens as hex (the OG renderer can't read CSS variables).
const BG = "#0e100c";
const FG = "#f4f3f0";
const MUTED = "#a5a5a1";
const ACCENT = "#c9ff64";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: BG,
          color: FG,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: ACCENT,
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Midpoint</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <div style={{ display: "flex", gap: 18 }}>
              <span>Trade Partner</span>
              <span style={{ color: ACCENT }}>Compliance</span>
            </div>
            <div style={{ display: "flex" }}>Without the Headache</div>
          </div>
          <div style={{ fontSize: 30, color: MUTED, maxWidth: 900 }}>
            Insurance verification, off your plate.
          </div>
        </div>
        <div style={{ fontSize: 26, color: MUTED }}>midpointverified.com</div>
      </div>
    ),
    size
  );
}
