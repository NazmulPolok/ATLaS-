import { ImageResponse } from "next/og";
export const alt = "ATLaS — We engineer what’s next";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#101827",
        color: "#fff",
        padding: "72px",
        fontFamily: "Arial",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 28,
          letterSpacing: 2,
        }}
      >
        <div
          style={{
            height: 48,
            width: 48,
            border: "1px solid #ff7547",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff7547",
          }}
        >
          A
        </div>{" "}
        ATLaS<span style={{ color: "#ff7547" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 88,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: -5,
        }}
      >
        We engineer <span style={{ color: "#ff7547" }}>what’s next.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          color: "#aab4c3",
          letterSpacing: 2,
        }}
      >
        <span>DIGITAL PRODUCTS · SECURE SYSTEMS · DISTINCTIVE EXPERIENCES</span>
        <span>BASED IN BANGLADESH</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 120,
          width: 330,
          height: 330,
          border: "1px solid #304058",
          borderRadius: 999,
        }}
      />
    </div>,
    size,
  );
}
