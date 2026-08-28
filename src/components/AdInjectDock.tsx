import type React from "react";
import type { DevToolsPosition } from "../types";

interface AdInjectDockProps {
  position: DevToolsPosition;
  slotCount: number;
  policyScore: number;
  isInspectActive: boolean;
  isInjectActive: boolean;
  overlayMode: boolean;
  onOpenPanel: () => void;
  onToggleInspect: () => void;
  onToggleInject: () => void;
  onToggleOverlay: () => void;
  onPositionChange: (pos: DevToolsPosition) => void;
}

export function AdInjectDock({
  position,
  slotCount,
  policyScore,
  isInspectActive,
  isInjectActive,
  overlayMode,
  onOpenPanel,
  onToggleInspect,
  onToggleInject,
  onToggleOverlay,
}: AdInjectDockProps) {
  return (
    <div className={`adinject-dock-toolbar pos-${position}`}>
      {/* Brand Icon Button */}
      <button
        type="button"
        onClick={onOpenPanel}
        title="Open AdInject DevTools (⌘+Shift+A)"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "2px 4px",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #00dc82 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 800,
            color: "#09090b",
            boxShadow: "0 0 10px rgba(0, 220, 130, 0.4)",
          }}
        >
          A
        </div>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>
          AdInject
        </span>
      </button>

      {/* Divider */}
      <div style={{ width: "1px", height: "16px", background: "rgba(255, 255, 255, 0.12)", margin: "0 2px" }} />

      {/* Inspect Element Button (Interactive Crosshair) */}
      <button
        type="button"
        onClick={onToggleInspect}
        className={`adinject-toolbar-btn ${isInspectActive ? "active" : ""}`}
        title="Hover & Inspect DOM elements on page"
      >
        <span style={{ fontSize: "13px" }}>🎯</span>
        <span>Inspect</span>
      </button>

      {/* Point-and-Click Inject Ad Button */}
      <button
        type="button"
        onClick={onToggleInject}
        className={`adinject-toolbar-btn ${isInjectActive ? "active" : ""}`}
        title="Point & Click to place an ad anywhere"
      >
        <span style={{ fontSize: "13px" }}>➕</span>
        <span>Inject</span>
      </button>

      {/* Overlays Toggle Button */}
      <button
        type="button"
        onClick={onToggleOverlay}
        className={`adinject-toolbar-btn ${overlayMode ? "active" : ""}`}
        title={overlayMode ? "Hide page visual overlays" : "Show page visual overlays"}
      >
        <span style={{ fontSize: "13px" }}>👁</span>
      </button>

      {/* Divider */}
      <div style={{ width: "1px", height: "16px", background: "rgba(255, 255, 255, 0.12)", margin: "0 2px" }} />

      {/* Slots Count Pill */}
      <button
        type="button"
        onClick={onOpenPanel}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: slotCount > 0 ? "rgba(0, 220, 130, 0.15)" : "rgba(255, 255, 255, 0.06)",
          border: `1px solid ${slotCount > 0 ? "rgba(0, 220, 130, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
          borderRadius: "9999px",
          padding: "3px 8px",
          color: slotCount > 0 ? "#00dc82" : "var(--ad-text-muted)",
          fontSize: "11px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <span>{slotCount} {slotCount === 1 ? "Ad" : "Ads"}</span>
      </button>

      {/* Policy Score Pill */}
      <button
        type="button"
        onClick={onOpenPanel}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: policyScore >= 90 ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)",
          border: `1px solid ${policyScore >= 90 ? "rgba(59, 130, 246, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
          borderRadius: "9999px",
          padding: "3px 8px",
          color: policyScore >= 90 ? "#60a5fa" : "#fbbf24",
          fontSize: "11px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <span>{policyScore}%</span>
      </button>

      {/* Open Full Drawer Icon */}
      <button
        type="button"
        onClick={onOpenPanel}
        title="Open Full Panel"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "none",
          borderRadius: "50%",
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "10px",
          cursor: "pointer",
          marginLeft: "2px",
        }}
      >
        ⤢
      </button>
    </div>
  );
}
