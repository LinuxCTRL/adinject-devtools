import type React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { InjectedAdPlacement } from "../types";
import { MockAdCanvas } from "./MockAdCanvas";

interface InjectedLiveAdProps {
  placement: InjectedAdPlacement;
  onRemove: (id: string) => void;
}

export function InjectedLiveAd({ placement, onRemove }: InjectedLiveAdProps) {
  const [copied, setCopied] = useState(false);

  if (!placement.containerElement || typeof document === "undefined") {
    return null;
  }

  const parent = placement.containerElement.parentElement || document.body;

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(placement.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div className="adinject-live-injected-container adinject-slot-frame" data-ad-slot={placement.recommendedProps.slot}>
      {/* Top Action & Info Bar */}
      <div className="adinject-injected-controls">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              background: "#3b82f6",
              color: "#fff",
              fontSize: "9px",
              fontWeight: 700,
              padding: "1px 5px",
              borderRadius: "3px",
            }}
          >
            INJECTED #{placement.index}
          </span>
          <span style={{ fontWeight: 600, color: "#fff" }}>
            {placement.format.toUpperCase()}
          </span>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>
            {placement.targetDescription}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={copyCode}
            style={{
              background: copied ? "#10b981" : "rgba(255, 255, 255, 0.12)",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "3px 8px",
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? "✓ Copied JSX" : "Copy JSX"}
          </button>

          <button
            type="button"
            onClick={() => onRemove(placement.id)}
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "4px",
              padding: "3px 8px",
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✕ Remove
          </button>
        </div>
      </div>

      {/* Live Mock Creative */}
      <div
        style={{
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          background: "#030712",
          padding: "12px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MockAdCanvas
          format={placement.format}
          theme={placement.theme}
          slotIndex={placement.index}
        />
      </div>
    </div>,
    parent
  );
}
