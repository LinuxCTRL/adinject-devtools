import type React from "react";
import type { InspectedElementInfo } from "../hooks/useElementInspector";

interface InspectorOverlayProps {
  isInspectMode: boolean;
  hoveredElement: InspectedElementInfo | null;
  onCancel: () => void;
}

export function InspectorOverlay({
  isInspectMode,
  hoveredElement,
  onCancel,
}: InspectorOverlayProps) {
  if (!isInspectMode || typeof window === "undefined") {
    return null;
  }

  return (
    <>
      {/* Top Banner */}
      <div className="adinject-inspect-active-banner">
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#00dc82",
            boxShadow: "0 0 10px #00dc82",
          }}
        />
        <span>
          🎯 Inspect Mode: Hover & click any paragraph or section to insert an ad
        </span>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "none",
            color: "#fff",
            borderRadius: "9999px",
            padding: "2px 10px",
            fontSize: "11px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ESC to Cancel
        </button>
      </div>

      {/* Hover Bounding Box */}
      {hoveredElement && (
        <div
          className="adinject-inspector-box"
          style={{
            top: `${hoveredElement.rect.top}px`,
            left: `${hoveredElement.rect.left}px`,
            width: `${hoveredElement.rect.width}px`,
            height: `${hoveredElement.rect.height}px`,
          }}
        >
          <div className="adinject-inspector-tooltip">
            <span>&lt;{hoveredElement.tagName}{hoveredElement.className ? `.${hoveredElement.className}` : ""}&gt;</span>
            {hoveredElement.wordCount > 0 && <span>• {hoveredElement.wordCount} words</span>}
            <span style={{ background: "#00dc82", padding: "1px 6px", borderRadius: "3px", fontSize: "10px", color: "#000", fontWeight: 700 }}>
              Click to Place Ad
            </span>
          </div>
        </div>
      )}
    </>
  );
}
