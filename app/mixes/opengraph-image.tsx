import { ImageResponse } from "next/og";

// Branded social share image for the /mixes library. Mix detail pages set their
// own artwork image via generateMetadata, so this covers the index only.
export const alt = "Transcend Mixes — house & trance sets by Eddie Barretta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #09080f 0%, #17122b 100%)",
          color: "#efedf6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#9a64ff",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: "#9a64ff",
            }}
          />
          Eddie Barretta
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, fontWeight: 800, lineHeight: 1 }}>
            Transcend Mixes
          </div>
          <div style={{ fontSize: 34, color: "#a6a2bc", marginTop: 26 }}>
            House &amp; trance DJ sets, with full tracklists
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#847f9c" }}>
          eddiebarretta.com/mixes
        </div>
      </div>
    ),
    { ...size },
  );
}
