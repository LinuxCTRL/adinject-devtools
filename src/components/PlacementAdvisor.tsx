import type React from "react";
import { useState } from "react";
import type { ContentAnalysis, DevToolsSlotInfo } from "../types";

interface PlacementAdvisorProps {
  analysis: ContentAnalysis;
  slots: DevToolsSlotInfo[];
}

export function PlacementAdvisor({ analysis, slots }: PlacementAdvisorProps) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const densityPercent = Math.round(analysis.adDensityRatio * 100);
  const isHealthyDensity = densityPercent <= 30;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const codeSnippet = `<InArticleAds
  html={articleHtml}
  interval={${analysis.optimalInterval}}
  startOffset={${analysis.optimalStartOffset}}
  maxAds={${Math.max(1, Math.min(4, Math.floor(analysis.totalParagraphs / analysis.optimalInterval)))}}
  slot="9876543210"
/>`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Content Statistics Card */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--ad-border)",
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Article Density & Spacing</h4>
            <span style={{ fontSize: "11px", color: "var(--ad-text-muted)" }}>
              Analysis of active article text & reading flow
            </span>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              background: isHealthyDensity ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: isHealthyDensity ? "#34d399" : "#f87171",
              border: `1px solid ${isHealthyDensity ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            }}
          >
            {isHealthyDensity ? "✓ Optimal Density" : "⚠ High Density"}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "6px",
            background: "rgba(0, 0, 0, 0.25)",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{analysis.totalWords}</div>
            <div style={{ fontSize: "9px", color: "var(--ad-text-muted)", textTransform: "uppercase" }}>Words</div>
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{analysis.totalParagraphs}</div>
            <div style={{ fontSize: "9px", color: "var(--ad-text-muted)", textTransform: "uppercase" }}>Paragraphs</div>
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>~{analysis.estimatedReadingTimeMin}m</div>
            <div style={{ fontSize: "9px", color: "var(--ad-text-muted)", textTransform: "uppercase" }}>Read Time</div>
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: isHealthyDensity ? "#10b981" : "#ef4444" }}>
              {densityPercent}%
            </div>
            <div style={{ fontSize: "9px", color: "var(--ad-text-muted)", textTransform: "uppercase" }}>Ad Density</div>
          </div>
        </div>
      </div>

      {/* Recommended Placement Rules */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>🎯</span>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#93c5fd" }}>
            Recommended Placement Recipe
          </h4>
        </div>

        <p style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: 1.5, margin: 0 }}>
          For this content length ({analysis.totalWords} words), the highest CTR with 0 bounce penalty is achieved with:
        </p>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
          <li style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
            <span style={{ color: "#34d399", fontWeight: 700 }}>•</span>
            <span><strong>interval={analysis.optimalInterval}</strong> — Place an ad slot every {analysis.optimalInterval} paragraphs</span>
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
            <span style={{ color: "#34d399", fontWeight: 700 }}>•</span>
            <span><strong>startOffset={analysis.optimalStartOffset}</strong> — Keep 1st paragraph ad-free to lock in reader focus</span>
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
            <span style={{ color: "#34d399", fontWeight: 700 }}>•</span>
            <span><strong>format="fluid"</strong> — Responsive in-article banner that fills container width smoothly</span>
          </li>
        </ul>

        {/* Code Snippet */}
        <div style={{ position: "relative", marginTop: "4px" }}>
          <pre
            style={{
              background: "#090d16",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "11px",
              fontFamily: "var(--ad-mono)",
              color: "#60a5fa",
              overflowX: "auto",
              margin: 0,
            }}
          >
            {codeSnippet}
          </pre>
          <button
            type="button"
            onClick={() => copyCode(codeSnippet)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: copiedSnippet ? "#10b981" : "rgba(255, 255, 255, 0.12)",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copiedSnippet ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Visual Paragraph & Placement Heatmap */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h4 style={{ fontSize: "12px", fontWeight: 600, color: "var(--ad-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Article Paragraph Flow & Ad Positions
          </h4>
          <span style={{ fontSize: "10px", color: "var(--ad-text-muted)" }}>
            {analysis.paragraphs.length} paragraphs evaluated
          </span>
        </div>

        {analysis.paragraphs.length === 0 ? (
          <div style={{ fontSize: "12px", color: "var(--ad-text-muted)", textAlign: "center", padding: "16px" }}>
            No article paragraphs found on current page.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {analysis.paragraphs.map((para) => (
              <div key={`para-${para.index}`} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {/* Paragraph Node */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--ad-border)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                    <span
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "var(--ad-text-muted)",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "3px",
                        fontFamily: "var(--ad-mono)",
                      }}
                    >
                      P{para.index}
                    </span>
                    <span
                      style={{
                        color: "var(--ad-text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {para.textSnippet}
                    </span>
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--ad-text-muted)", flexShrink: 0 }}>
                    {para.wordCount}w
                  </span>
                </div>

                {/* Ad Position Marker if active */}
                {para.hasAdAfter && (
                  <div
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      border: "1px solid #3b82f6",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      fontSize: "11px",
                      color: "#93c5fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "0 8px",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>📍 Active Ad Slot (Inserted here)</span>
                    <span style={{ fontSize: "10px", opacity: 0.8 }}>Zero CLS Protected</span>
                  </div>
                )}

                {/* Recommendation Marker if recommended slot without active ad */}
                {!para.hasAdAfter && para.isRecommendedSlot && (
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px dashed #10b981",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      fontSize: "10px",
                      color: "#6ee7b7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "0 8px",
                    }}
                  >
                    <span>⭐ Recommended insertion spot ({para.recommendationReason})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
