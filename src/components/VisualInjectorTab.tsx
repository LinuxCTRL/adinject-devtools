import type React from "react";
import { useState } from "react";
import type { AdFormat, InjectedAdPlacement, MockTheme } from "../types";
import { getTargetFilePath } from "../utils/route-detector";

interface VisualInjectorTabProps {
  placements: InjectedAdPlacement[];
  isInjectingMode: boolean;
  selectedFormat: AdFormat;
  selectedTheme: MockTheme;
  onStartInject: (format: AdFormat, theme: MockTheme) => void;
  onAutoPick: () => void;
  onStopInject: () => void;
  onRemovePlacement: (id: string) => void;
  onClearAll: () => void;
  onThemeChange: (theme: MockTheme) => void;
}

const FORMAT_OPTIONS: { id: AdFormat; name: string; dims: string; icon: string }[] = [
  { id: "fluid", name: "In-Article Fluid", dims: "Responsive", icon: "📰" },
  { id: "rectangle", name: "Medium Rectangle", dims: "300×250", icon: "📦" },
  { id: "horizontal", name: "Leaderboard Banner", dims: "728×90", icon: "📏" },
  { id: "vertical", name: "Skyscraper", dims: "160×600", icon: "📱" },
];

export function VisualInjectorTab({
  placements,
  isInjectingMode,
  selectedFormat,
  selectedTheme,
  onStartInject,
  onAutoPick,
  onStopInject,
  onRemovePlacement,
  onClearAll,
  onThemeChange,
}: VisualInjectorTabProps) {
  const [exportViewMode, setExportViewMode] = useState<"jsx" | "ai-prompt">("ai-prompt");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState<string | null>(null);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const { filePath, componentName } = getTargetFilePath(pathname);

  // 1. Raw JSX Export
  const fullCodeExport = `// =========================================================================
// 📁 TARGET FILE: ${filePath} (Route: "${pathname}")
// =========================================================================

// 1. Add imports to the top of ${filePath}:
import { AdSenseSlot } from "adinject-react";

// 2. Paste inside <${componentName} /> at the indicated locations:
${placements
  .map(
    (p, idx) =>
      `// ─── Placement #${idx + 1} (${p.format.toUpperCase()}) ───────────────────
// 📍 Location: ${p.contextHint || p.targetDescription}
${p.codeSnippet.split("\n").filter((line) => !line.startsWith("//")).join("\n").trim()}`
  )
  .join("\n\n")}`;

  // 2. Markdown AI Prompt Export (Cursor, Claude, ChatGPT, Copilot)
  const fullAiPrompt = `Please update my Next.js file to inject ad monetization slots using \`adinject-react\`.

### 📁 Target File
\`${filePath}\` (Route: "${pathname}", Component: \`<${componentName} />\`)

### 📦 Required Import
Add this import at the top of \`${filePath}\`:
\`\`\`tsx
import { AdSenseSlot } from "adinject-react";
\`\`\`

### 📍 Ad Placements to Insert
${placements
  .map((p, idx) => {
    const rawJsx = p.codeSnippet.split("\n").filter((line) => !line.startsWith("//")).join("\n").trim();
    return `${idx + 1}. **Placement #${idx + 1} (${p.format.toUpperCase()})**
   - **Target Anchor**: ${p.contextHint || p.targetDescription}
   - **JSX Snippet**:
\`\`\`tsx
${rawJsx}
\`\`\``;
  })
  .join("\n\n")}

### 🎯 Instructions for AI
- Keep all existing JSX and layout structure intact.
- Insert each \`<AdSenseSlot />\` at the specified location with appropriate vertical spacing (e.g. \`className="my-6 w-full"\`).
- Preserve the exact \`dimensions\` prop to guarantee Zero Cumulative Layout Shift (Zero CLS).`;

  const copyFullCode = () => {
    navigator.clipboard.writeText(fullCodeExport);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyAiPrompt = () => {
    navigator.clipboard.writeText(fullAiPrompt);
    setCopiedAiPrompt(true);
    setTimeout(() => setCopiedAiPrompt(false), 2000);
  };

  const copySingle = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSingle(id);
    setTimeout(() => setCopiedSingle(null), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 1. Target File Context Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--ad-border)",
          borderRadius: "10px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "15px" }}>📁</span>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>
              Target File: <code style={{ color: "#60a5fa" }}>{filePath}</code>
            </div>
            <div style={{ fontSize: "10px", color: "var(--ad-text-muted)" }}>
              Component: <strong>&lt;{componentName} /&gt;</strong> • Route: <strong>{pathname}</strong>
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: "10px",
            background: "rgba(59, 130, 246, 0.15)",
            color: "#93c5fd",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "2px 8px",
            borderRadius: "6px",
            fontWeight: 600,
          }}
        >
          Next.js App Router
        </span>
      </div>

      {/* 2. Auto-Pick Magic Button */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(0, 220, 130, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
          border: "1px solid rgba(0, 220, 130, 0.35)",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 24px rgba(0, 220, 130, 0.1)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "16px" }}>✨</span>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
              Auto-Pick Best Places For Me
            </h4>
            <span
              style={{
                fontSize: "9px",
                background: "#00dc82",
                color: "#000",
                fontWeight: 800,
                padding: "1px 5px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              Recommended
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--ad-text-muted)", margin: "4px 0 0" }}>
            Analyzes {filePath} structure to automatically place high-CTR ads with zero layout shift.
          </p>
        </div>

        <button
          type="button"
          onClick={onAutoPick}
          style={{
            background: "linear-gradient(135deg, #00dc82 0%, #3b82f6 100%)",
            color: "#09090b",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(0, 220, 130, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>✨ Auto-Place Ads</span>
        </button>
      </div>

      {/* 3. Manual Format Selection */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
          Or Manually Choose Format to Drop
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {FORMAT_OPTIONS.map((opt) => {
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onStartInject(opt.id, selectedTheme)}
                style={{
                  background:
                    isInjectingMode && selectedFormat === opt.id
                      ? "rgba(59, 130, 246, 0.25)"
                      : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${
                    isInjectingMode && selectedFormat === opt.id ? "#3b82f6" : "var(--ad-border)"
                  }`,
                  borderRadius: "10px",
                  padding: "10px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{opt.icon}</span>
                    <span>{opt.name}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--ad-text-muted)", fontFamily: "var(--ad-mono)", marginTop: "2px" }}>
                    {opt.dims}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#60a5fa",
                    background: "rgba(59, 130, 246, 0.15)",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontWeight: 700,
                  }}
                >
                  + Drop
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Injection Mode Status Banner */}
      {isInjectingMode && (
        <div
          style={{
            background: "rgba(59, 130, 246, 0.15)",
            border: "1px solid #3b82f6",
            borderRadius: "10px",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🎯</span>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>
                Click-to-Inject Mode Active
              </div>
              <div style={{ fontSize: "10px", color: "#93c5fd" }}>
                Hover and click any "+ Click to Inject" button on the webpage
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onStopInject}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#fff",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Done
          </button>
        </div>
      )}

      {/* Placed Ads List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
            Active Placements on This Page ({placements.length})
          </span>
          {placements.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              style={{
                background: "transparent",
                border: "none",
                color: "#f87171",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              Clear All Placements
            </button>
          )}
        </div>

        {placements.length === 0 ? (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px dashed var(--ad-border)",
              borderRadius: "10px",
              padding: "24px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>📍</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
              No visual ads placed yet
            </div>
            <div style={{ fontSize: "11px", color: "var(--ad-text-muted)", marginTop: "2px" }}>
              Click <strong>"Auto-Pick Best Places For Me"</strong> to place ads in <code style={{ color: "#60a5fa" }}>{filePath}</code>.
            </div>
          </div>
        ) : (
          placements.map((p) => {
            return (
              <div
                key={p.id}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--ad-border)",
                  borderRadius: "10px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {/* Placement Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        background: "#1e293b",
                        color: "#93c5fd",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "3px",
                      }}
                    >
                      #{p.index}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>
                      {p.format.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--ad-text-muted)" }}>
                      {p.targetDescription}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => copySingle(p.id, p.codeSnippet)}
                      style={{
                        background: copiedSingle === p.id ? "#10b981" : "rgba(255, 255, 255, 0.08)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {copiedSingle === p.id ? "✓ Copied" : "Copy JSX"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemovePlacement(p.id)}
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        color: "#f87171",
                        border: "none",
                        borderRadius: "4px",
                        padding: "3px 8px",
                        fontSize: "10px",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Where to Paste Hint Badge */}
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    borderLeft: "2px solid #3b82f6",
                    padding: "5px 8px",
                    borderRadius: "0 4px 4px 0",
                    fontSize: "10px",
                    color: "#cbd5e1",
                  }}
                >
                  <strong>📁 File: </strong> <span style={{ color: "#60a5fa", fontFamily: "var(--ad-mono)" }}>{p.targetFilePath || filePath}</span>
                  <span style={{ margin: "0 6px", opacity: 0.5 }}>|</span>
                  <strong>📍 Location: </strong> <span>{p.contextHint || p.targetDescription}</span>
                </div>

                {/* Code Box */}
                <pre
                  style={{
                    background: "#090d16",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    fontSize: "10px",
                    fontFamily: "var(--ad-mono)",
                    color: "#60a5fa",
                    margin: 0,
                    overflowX: "auto",
                  }}
                >
                  {p.codeSnippet}
                </pre>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Complete Code & AI Prompt Exporter */}
      {placements.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.35)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Header with Switcher between AI Prompt & Raw JSX */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px" }}>🤖</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                  Export For AI & Developers ({placements.length} slots)
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--ad-text-muted)" }}>
                Target: <strong style={{ color: "#60a5fa" }}>{filePath}</strong>
              </div>
            </div>

            {/* Segmented Switcher */}
            <div
              style={{
                display: "flex",
                background: "rgba(0, 0, 0, 0.4)",
                borderRadius: "8px",
                padding: "2px",
                border: "1px solid var(--ad-border)",
              }}
            >
              <button
                type="button"
                onClick={() => setExportViewMode("ai-prompt")}
                style={{
                  background: exportViewMode === "ai-prompt" ? "linear-gradient(135deg, #00dc82 0%, #3b82f6 100%)" : "transparent",
                  color: exportViewMode === "ai-prompt" ? "#09090b" : "var(--ad-text-muted)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>🤖 AI Prompt</span>
              </button>
              <button
                type="button"
                onClick={() => setExportViewMode("jsx")}
                style={{
                  background: exportViewMode === "jsx" ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  color: exportViewMode === "jsx" ? "#fff" : "var(--ad-text-muted)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <span>📄 Raw JSX</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={copyAiPrompt}
              style={{
                flex: 1,
                background: copiedAiPrompt ? "#10b981" : "linear-gradient(135deg, #00dc82 0%, #3b82f6 100%)",
                color: "#09090b",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
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
              <span>🤖</span>
              <span>{copiedAiPrompt ? "✓ Copied AI Prompt!" : "Copy AI Prompt (Cursor / Claude / Copilot)"}</span>
            </button>

            <button
              type="button"
              onClick={copyFullCode}
              style={{
                background: copiedAll ? "#10b981" : "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                border: "1px solid var(--ad-border)",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {copiedAll ? "✓ Copied JSX" : "Copy JSX"}
            </button>
          </div>

          {/* Code or AI Prompt Preview Box */}
          <pre
            style={{
              background: "#090d16",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "10px",
              fontFamily: "var(--ad-mono)",
              color: exportViewMode === "ai-prompt" ? "#6ee7b7" : "#93c5fd",
              margin: 0,
              maxHeight: "180px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {exportViewMode === "ai-prompt" ? fullAiPrompt : fullCodeExport}
          </pre>
        </div>
      )}
    </div>
  );
}
