import type React from "react";
import type { DevToolsSlotInfo } from "../types";

interface VisualOverlayProps {
  slots: DevToolsSlotInfo[];
  highlightSlotId: string | null;
  onSelectSlot?: (slot: DevToolsSlotInfo) => void;
}

export function VisualOverlay({ slots, highlightSlotId, onSelectSlot }: VisualOverlayProps) {
  if (typeof window === "undefined" || slots.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 999980,
      }}
    >
      {slots.map((slot) => {
        const isHighlighted = highlightSlotId === slot.id;
        const { top, left, width, height } = slot.boundingRect;

        // Skip zero-dimension or hidden elements
        if (width <= 0 || height <= 0) return null;

        // Don't render full-window overlay bars
        const isFullWidth = width >= (window.innerWidth || 1200) - 20;
        const displayWidth = isFullWidth ? Math.min(1100, width - 40) : width;
        const displayLeft = isFullWidth ? (window.innerWidth - displayWidth) / 2 : left;

        return (
          <div
            key={slot.id}
            className={`adinject-overlay-box ${isHighlighted ? "highlighted" : ""}`}
            style={{
              top: `${top}px`,
              left: `${displayLeft}px`,
              width: `${displayWidth}px`,
              height: `${height}px`,
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onClick={() => {
              slot.element.scrollIntoView({ behavior: "smooth", block: "center" });
              onSelectSlot?.(slot);
            }}
          >
            <div
              className="adinject-overlay-badge"
              style={{
                background: isHighlighted ? "rgba(6, 78, 59, 0.9)" : "rgba(15, 23, 42, 0.88)",
                borderColor: isHighlighted ? "#10b981" : "#3b82f6",
                color: isHighlighted ? "#6ee7b7" : "#93c5fd",
              }}
            >
              <span>#{slot.slotNumber}</span>
              <span>•</span>
              <span>{slot.format.toUpperCase()}</span>
              <span>•</span>
              <span>{Math.round(displayWidth)}×{Math.round(height)}px</span>
              {slot.hasClsProtection && (
                <>
                  <span>•</span>
                  <span style={{ color: "#34d399" }}>Zero CLS</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
