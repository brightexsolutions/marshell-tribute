import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Marshell Okatch";
  const year = searchParams.get("year") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#16161a",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Gold top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #c9a96e, #8b6f3e)",
            display: "flex",
          }}
        />

        {/* Subtle background texture — radial gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,169,110,0.06) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Text content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "5px",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              fontWeight: 400,
            }}
          >
            In Loving Memory
          </span>

          <span
            style={{
              fontSize: name.length > 20 ? "60px" : "72px",
              color: "#f0ebe0",
              fontWeight: 700,
              lineHeight: 1.1,
              fontFamily: "serif",
            }}
          >
            {name}
          </span>

          {year && (
            <span
              style={{
                fontSize: "26px",
                color: "rgba(255,255,255,0.38)",
                fontFamily: "sans-serif",
                fontWeight: 300,
                marginTop: "4px",
              }}
            >
              {year}
            </span>
          )}
        </div>

        {/* Candle icon — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "56px",
            right: "72px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            opacity: 0.25,
          }}
        >
          {/* Flame */}
          <div
            style={{
              width: "16px",
              height: "22px",
              borderRadius: "50% 50% 30% 30%",
              background: "#f59e0b",
              display: "flex",
            }}
          />
          {/* Wick */}
          <div
            style={{
              width: "2px",
              height: "6px",
              background: "#c4a882",
              display: "flex",
            }}
          />
          {/* Candle body */}
          <div
            style={{
              width: "22px",
              height: "36px",
              borderRadius: "2px",
              background: "#c4a882",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
