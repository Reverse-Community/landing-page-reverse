import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "radial-gradient(circle at 20% 20%, rgba(255,59,59,.28), transparent 420px), radial-gradient(circle at 80% 20%, rgba(47,125,255,.28), transparent 420px), #050509",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: 80,
          width: "100%"
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 12, opacity: 0.75 }}>REVERSE COMMUNITY</div>
        <div style={{ fontSize: 112, fontWeight: 900, letterSpacing: -8, marginTop: 32, textAlign: "center" }}>Connect. Play. Grow.</div>
        <div style={{ color: "#aeb7d0", fontSize: 34, marginTop: 28, textAlign: "center" }}>reverse.my.id</div>
      </div>
    ),
    size
  );
}
