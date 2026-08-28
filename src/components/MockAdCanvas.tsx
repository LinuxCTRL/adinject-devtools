import type React from "react";
import type { AdFormat, MockTheme } from "../types";
import { getMockCreative } from "../utils/mock-creatives";

interface MockAdCanvasProps {
  format?: AdFormat | string;
  theme?: MockTheme;
  slotIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MockAdCanvas({
  format = "fluid",
  theme = "tech",
  slotIndex = 0,
  className = "",
  style,
}: MockAdCanvasProps) {
  const creative = getMockCreative(theme, slotIndex);

  // Horizontal Leaderboard (728x90)
  if (format === "horizontal") {
    return (
      <div
        className={`adinject-mock-ad-leaderboard ${className}`}
        style={{
          width: "100%",
          maxWidth: "728px",
          minHeight: "90px",
          margin: "0 auto",
          background: creative.bgGradient,
          borderRadius: "8px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#fff",
          border: `1px solid ${creative.accentColor}40`,
          boxShadow: `0 4px 14px ${creative.accentColor}20`,
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
          <div
            style={{
              fontSize: "24px",
              padding: "6px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
            }}
          >
            {creative.imageIcon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700 }}>{creative.brand}</span>
              <span
                style={{
                  fontSize: "9px",
                  padding: "1px 5px",
                  borderRadius: "3px",
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "#cbd5e1",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Mock Ad
              </span>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#e2e8f0",
                margin: "2px 0 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {creative.tagline}
            </p>
          </div>
        </div>

        <button
          type="button"
          style={{
            background: creative.accentColor,
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {creative.ctaText}
        </button>
      </div>
    );
  }

  // Vertical Skyscraper (160x600)
  if (format === "vertical") {
    return (
      <div
        className={`adinject-mock-ad-skyscraper ${className}`}
        style={{
          width: "160px",
          minHeight: "600px",
          background: creative.bgGradient,
          borderRadius: "8px",
          padding: "20px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-between",
          color: "#fff",
          border: `1px solid ${creative.accentColor}40`,
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
      >
        <div>
          <span
            style={{
              fontSize: "9px",
              padding: "2px 6px",
              borderRadius: "3px",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#cbd5e1",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Mock Ad
          </span>
          <div style={{ fontSize: "36px", margin: "20px 0 10px" }}>{creative.imageIcon}</div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 8px" }}>{creative.brand}</h4>
          <p style={{ fontSize: "11px", color: "#e2e8f0", lineHeight: 1.4 }}>{creative.tagline}</p>
        </div>

        <div style={{ width: "100%" }}>
          <button
            type="button"
            style={{
              width: "100%",
              background: creative.accentColor,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 8px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {creative.ctaText}
          </button>
          <div style={{ fontSize: "8px", color: "#94a3b8", marginTop: "8px" }}>160x600 Skyscraper</div>
        </div>
      </div>
    );
  }

  // Medium Rectangle (300x250) or Fluid In-Article Banner
  return (
    <div
      className={`adinject-mock-ad-card ${className}`}
      style={{
        width: "100%",
        maxWidth: format === "rectangle" ? "300px" : "100%",
        minHeight: "250px",
        margin: "0 auto",
        background: creative.bgGradient,
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#fff",
        border: `1px solid ${creative.accentColor}50`,
        boxShadow: `0 8px 24px ${creative.accentColor}25`,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "100px",
          height: "100px",
          background: creative.accentColor,
          opacity: 0.15,
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
      />

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.12)",
              color: "#cbd5e1",
              letterSpacing: "0.5px",
            }}
          >
            {creative.badge}
          </span>
          <span style={{ fontSize: "10px", opacity: 0.6, fontFamily: "monospace" }}>
            {format.toUpperCase()} • ZERO CLS
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div
            style={{
              fontSize: "30px",
              padding: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {creative.imageIcon}
          </div>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, margin: 0, letterSpacing: "-0.2px" }}>
              {creative.brand}
            </h3>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>{creative.category}</span>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: 1.5, margin: 0 }}>
          {creative.tagline}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
        <button
          type="button"
          style={{
            background: creative.accentColor,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{creative.ctaText}</span>
          <span>→</span>
        </button>

        <span style={{ fontSize: "10px", color: "#94a3b8", opacity: 0.8 }}>AdInject Mock Ad</span>
      </div>
    </div>
  );
}
