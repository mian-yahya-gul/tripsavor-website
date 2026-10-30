import { ImageResponse } from "next/og";

export const alt = "TripSavor — Book Smarter. Fly Further.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #041c2f 0%, #0c4573 60%, #1676c4 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 34, color: "#f8b94f", fontWeight: 700, letterSpacing: 2 }}>TRIPSAVOR TRAVELS</div>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>Book Smarter.</div>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05, color: "#f8b94f" }}>Fly Further.</div>
        <div style={{ fontSize: 30, marginTop: 32, color: "#b9dcf9" }}>
          Cheap flights from Pakistan · Umrah · Group tickets · 24/7 human support
        </div>
      </div>
    ),
    size
  );
}
