import type React from "react";
import { useState } from "react";
import type { AdFormat, MockTheme } from "../types";
import { getTargetFilePath } from "../utils/route-detector";
import { MockAdCanvas } from "./MockAdCanvas";

interface MockAdsTabProps {
  currentTheme: MockTheme;
  onThemeChange: (theme: MockTheme) => void;
  onInjectAd: (format: AdFormat, theme: MockTheme) => void;
}

const THEMES: { id: MockTheme; name: string; icon: string }[] = [
  { id: "tech", name: "Developer Cloud", icon: "⚡" },
  { id: "saas", name: "SaaS & AI", icon: "📊" },
  { id: "food", name: "Culinary & Food", icon: "🔪" },
  { id: "ecommerce", name: "E-Commerce", icon: "👟" },
  { id: "travel", name: "Travel & Escapes", icon: "❄️" },
  { id: "finance", name: "Fintech & Wealth", icon: "📈" },
];

const FORMATS: { id: AdFormat; name: string; dims: string; desc: string }[] = [
  { id: "fluid", name: "In-Article Fluid", dims: "Responsive", desc: "Native in-article banner" },
  { id: "rectangle", name: "Medium Rectangle", dims: "300×250", desc: "Sidebar & content grid" },
  { id: "horizontal", name: "Leaderboard Banner", dims: "728×90", desc: "Header & section divider" },
  { id: "vertical", name: "Skyscraper", dims: "160×600", desc: "Sticky side column" },
];

export function MockAdsTab({ currentTheme, onThemeChange, onInjectAd }: MockAdsTabProps) {
  const [selectedFormat, setSelectedFormat] = useState<AdFormat>("fluid");
  const [copiedJsx, setCopiedJsx] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const { filePath } = getTargetFilePath(pathname);

  const minHeight = selectedFormat === "horizontal" ? 90 : selectedFormat === "vertical" ? 600 : 250;
  const aspectRatio =
    selectedFormat === "rectangle"
      ? "300/250"
      : selectedFormat === "horizontal"
      ? "728/90"
      : selectedFormat === "vertical"
      ? "160/600"
      : undefined;

  const jsxSnippet = `<AdSenseSlot
  slot="${Math.floor(1000000000 + Math.random() * 9000000000)}"
  format="${selectedFormat}"${aspectRatio ? `\n  dimensions={{ minHeight: ${minHeight}, aspectRatio: "${aspectRatio}" }}` : ""}
/>`;

  const aiPromptSnippet = `Please insert an ad slot into \`${filePath}\`:
\`\`\`tsx
import { AdSenseSlot } from "adinject-react";

${jsxSnippet}
\`\`\`
Ensure zero Cumulative Layout Shift (CLS) by preserving the dimension settings.`;

  const copyJsx = () => {
    navigator.clipboard.writeText(jsxSnippet);
    setCopiedJsx(true);
    setTimeout(() => setCopiedJsx(false), 2000);
  };

  const copyAi = () => {
    navigator.clipboard.writeText(aiPromptSnippet);
    setCopiedAi(true);
    setTimeout(() => setCopiedAi(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
            Creative Mockup Studio
          </h4>
          <p style={{ fontSize: "11px", color: "var(--ad-text-muted)", margin: "2px 0 0" }}>
            Click any creative below to instantly drop it into your live webpage
          </p>
        </div>

        <button
          type="button"
          onClick={() => onInjectAd(selectedFormat, currentTheme)}
          style={{
            background: "linear-gradient(135deg, #00dc82 0%, #3b82f6 100%)",
            color: "#09090b",
            border: "none",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 14px rgba(0, 220, 130, 0.3)",
          }}
        >
          <span>🚀 Drop onto Webpage</span>
        </button>
      </div>

      {/* Theme Selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
          1. Select Industry Theme
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onThemeChange(theme.id)}
                style={{
                  background: isSelected ? "rgba(0, 220, 130, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isSelected ? "#00dc82" : "var(--ad-border)"}`,
                  borderRadius: "8px",
                  padding: "8px 6px",
                  color: isSelected ? "#00dc82" : "var(--ad-text-muted)",
                  fontSize: "11px",
                  fontWeight: isSelected ? 700 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{theme.icon}</span>
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format Selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
          2. Select Ad Format
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
          {FORMATS.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                style={{
                  background: isSelected ? "rgba(59, 130, 246, 0.18)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isSelected ? "#3b82f6" : "var(--ad-border)"}`,
                  borderRadius: "8px",
                  padding: "8px 10px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: isSelected ? "#fff" : "var(--ad-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600 }}>{fmt.name}</div>
                  <div style={{ fontSize: "9px", opacity: 0.6, fontFamily: "var(--ad-mono)" }}>{fmt.dims}</div>
                </div>
                {isSelected && (
                  <span style={{ fontSize: "10px", color: "#60a5fa", fontWeight: 700 }}>✓ Selected</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Click-to-Inject Preview Canvas */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
            3. Interactive Live Preview (Click card to inject onto page)
          </span>
          <span style={{ fontSize: "10px", color: "#00dc82", fontWeight: 600 }}>
            ● Zero-CLS Guaranteed
          </span>
        </div>

        <div
          onClick={() => onInjectAd(selectedFormat, currentTheme)}
          title="Click to place this creative directly into your webpage"
          style={{
            background: "#030712",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "260px",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
            transition: "transform 0.15s ease, border-color 0.15s ease",
          }}
        >
          {/* Top Banner on Hover */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0, 220, 130, 0.2)",
              border: "1px solid rgba(0, 220, 130, 0.4)",
              color: "#00dc82",
              padding: "2px 8px",
              borderRadius: "9999px",
              fontSize: "10px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              zIndex: 10,
            }}
          >
            <span>👉 Click to Place on Webpage</span>
          </div>

          <MockAdCanvas format={selectedFormat} theme={currentTheme} />
        </div>
      </div>

      {/* 4. Quick Export Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          type="button"
          onClick={() => onInjectAd(selectedFormat, currentTheme)}
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #00dc82 0%, #3b82f6 100%)",
            color: "#09090b",
            border: "none",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: "0 4px 14px rgba(0, 220, 130, 0.25)",
          }}
        >
          <span>🎯</span>
          <span>Place {selectedFormat.toUpperCase()} Ad on Webpage</span>
        </button>

        <button
          type="button"
          onClick={copyAi}
          style={{
            background: copiedAi ? "#10b981" : "rgba(255, 255, 255, 0.08)",
            color: "#fff",
            border: "1px solid var(--ad-border)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {copiedAi ? "✓ Copied AI Prompt" : "🤖 Copy AI Prompt"}
        </button>

        <button
          type="button"
          onClick={copyJsx}
          style={{
            background: copiedJsx ? "#10b981" : "rgba(255, 255, 255, 0.08)",
            color: "#fff",
            border: "1px solid var(--ad-border)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {copiedJsx ? "✓ Copied JSX" : "📄 Copy JSX"}
        </button>
      </div>
    </div>
  );
}
