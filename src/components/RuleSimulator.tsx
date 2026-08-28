import type React from "react";
import { useState } from "react";
import type { ContentAnalysis } from "../types";

interface RuleSimulatorProps {
  analysis: ContentAnalysis;
  initialInterval: number;
  initialStartOffset: number;
  initialMaxAds: number;
  onRuleChange: (rule: { interval: number; startOffset: number; maxAds: number }) => void;
}

export function RuleSimulator({
  analysis,
  initialInterval,
  initialStartOffset,
  initialMaxAds,
  onRuleChange,
}: RuleSimulatorProps) {
  const [interval, setInterval] = useState(initialInterval);
  const [startOffset, setStartOffset] = useState(initialStartOffset);
  const [maxAds, setMaxAds] = useState(initialMaxAds);
  const [copied, setCopied] = useState(false);

  const handleIntervalChange = (val: number) => {
    setInterval(val);
    onRuleChange({ interval: val, startOffset, maxAds });
  };

  const handleOffsetChange = (val: number) => {
    setStartOffset(val);
    onRuleChange({ interval, startOffset: val, maxAds });
  };

  const handleMaxAdsChange = (val: number) => {
    setMaxAds(val);
    onRuleChange({ interval, startOffset, maxAds: val });
  };

  // Calculate projected ad positions
  const totalParagraphs = analysis.totalParagraphs || 10;
  const projectedSlots: number[] = [];
  for (let i = startOffset; i < totalParagraphs; i += interval) {
    if (projectedSlots.length < maxAds) {
      projectedSlots.push(i);
    }
  }

  const generatedCode = `<InArticleAds
  html={articleHtml}
  interval={${interval}}
  startOffset={${startOffset}}
  maxAds={${maxAds}}
  slot="9876543210"
/>`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Interactive Rule Sandbox</h4>
        <p style={{ fontSize: "11px", color: "var(--ad-text-muted)", margin: "2px 0 0" }}>
          Test paragraph intervals and offsets to preview placement behavior
        </p>
      </div>

      {/* Sliders Controls */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--ad-border)",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Interval Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>
              Paragraph Interval (<code style={{ color: "#60a5fa" }}>interval</code>)
            </label>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#60a5fa",
                background: "rgba(59, 130, 246, 0.15)",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              Every {interval} paragraphs
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            value={interval}
            onChange={(e) => handleIntervalChange(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>

        {/* Start Offset Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>
              Initial Offset (<code style={{ color: "#60a5fa" }}>startOffset</code>)
            </label>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#60a5fa",
                background: "rgba(59, 130, 246, 0.15)",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              After P{startOffset}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            value={startOffset}
            onChange={(e) => handleOffsetChange(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>

        {/* Max Ads Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>
              Max Ads Limit (<code style={{ color: "#60a5fa" }}>maxAds</code>)
            </label>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#60a5fa",
                background: "rgba(59, 130, 246, 0.15)",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              {maxAds} ads max
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            value={maxAds}
            onChange={(e) => handleMaxAdsChange(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Projected Insertion Map */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid var(--ad-border)",
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>
            Projected Ad Placements ({projectedSlots.length} ads)
          </span>
          <span style={{ fontSize: "10px", color: "var(--ad-text-muted)" }}>
            In {totalParagraphs} paragraphs
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {Array.from({ length: totalParagraphs }).map((_, idx) => {
            const pNum = idx + 1;
            const hasAd = projectedSlots.includes(pNum);
            return (
              <div
                key={`p-preview-${pNum}`}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontFamily: "var(--ad-mono)",
                  background: hasAd ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${hasAd ? "#3b82f6" : "rgba(255, 255, 255, 0.08)"}`,
                  color: hasAd ? "#93c5fd" : "var(--ad-text-muted)",
                  fontWeight: hasAd ? 700 : 400,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>P{pNum}</span>
                {hasAd && <span>👉 Ad</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Generated Code Snippet */}
      <div style={{ position: "relative" }}>
        <pre
          style={{
            background: "#090d16",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            padding: "12px 14px",
            fontSize: "11px",
            fontFamily: "var(--ad-mono)",
            color: "#60a5fa",
            overflowX: "auto",
            margin: 0,
          }}
        >
          {generatedCode}
        </pre>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(generatedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: copied ? "#10b981" : "rgba(255, 255, 255, 0.15)",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {copied ? "✓ Copied" : "Copy Code"}
        </button>
      </div>
    </div>
  );
}
