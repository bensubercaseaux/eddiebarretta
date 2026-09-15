import { ImageResponse } from "next/og";

// Branded share image for the hire-intent pages; same Satori-safe treatment as
// app/opengraph-image.tsx and app/mixes/opengraph-image.tsx.
export const serviceOgSize = { width: 1200, height: 630 };

export function serviceOgImage(title: string, subtitle: string, path: string) {
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
          <div style={{ width: 16, height: 16, borderRadius: 9999, background: "#9a64ff" }} />
          Book Eddie Barretta
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1 }}>{title}</div>
          <div style={{ fontSize: 34, color: "#a6a2bc", marginTop: 26 }}>{subtitle}</div>
        </div>

        <div style={{ fontSize: 26, color: "#847f9c" }}>{path}</div>
      </div>
    ),
    { ...serviceOgSize },
  );
}
