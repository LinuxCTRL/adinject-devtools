import type React from "react";
import type { DevToolsSlotInfo } from "../types";

interface SlotsInspectorProps {
  slots: DevToolsSlotInfo[];
  highlightSlotId: string | null;
  onHighlightSlot: (slotId: string | null) => void;
  onRefresh: () => void;
}

export function SlotsInspector({
  slots,
  highlightSlotId,
  onHighlightSlot,
  onRefresh,
}: SlotsInspectorProps) {
  const inViewportCount = slots.filter((s) => s.isInViewport).length;
  const clsSafeCount = slots.filter((s) => s.hasClsProtection).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--ad-border)",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{slots.length}</div>
          <div style={{ fontSize: "10px", color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
            Total Slots
          </div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--ad-border)",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#10b981" }}>{inViewportCount}</div>
          <div style={{ fontSize: "10px", color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
            In Viewport
          </div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--ad-border)",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#3b82f6" }}>
            {slots.length > 0 ? `${Math.round((clsSafeCount / slots.length) * 100)}%` : "100%"}
          </div>
          <div style={{ fontSize: "10px", color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
            CLS Protected
          </div>
        </div>
      </div>

      {/* Slots List */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ fontSize: "12px", fontWeight: 600, color: "var(--ad-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Registered Ad Slots ({slots.length})
        </h4>
        <button
          type="button"
          onClick={onRefresh}
          style={{
            background: "transparent",
            border: "none",
            color: "#60a5fa",
            fontSize: "11px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>↻ Re-scan DOM</span>
        </button>
      </div>

      {slots.length === 0 ? (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px dashed var(--ad-border)",
            borderRadius: "12px",
            padding: "32px 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔍</div>
          <h5 style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
            No Active Ad Slots Found
          </h5>
          <p style={{ fontSize: "12px", color: "var(--ad-text-muted)", maxWidth: "300px", margin: "0 auto" }}>
            Place an &lt;AdSenseSlot /&gt; or &lt;InArticleAds /&gt; on this page to inspect live bounding boxes and CLS status.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {slots.map((slot) => {
            const isHighlighted = highlightSlotId === slot.id;
            return (
              <div
                key={slot.id}
                onMouseEnter={() => onHighlightSlot(slot.id)}
                onMouseLeave={() => onHighlightSlot(null)}
                style={{
                  background: isHighlighted ? "rgba(59, 130, 246, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isHighlighted ? "rgba(59, 130, 246, 0.4)" : "var(--ad-border)"}`,
                  borderRadius: "12px",
                  padding: "14px",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        background: "#1e293b",
                        color: "#93c5fd",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      #{slot.slotNumber}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                      Slot: {slot.slotId}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "var(--ad-text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {slot.parentType}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      background: slot.isInViewport ? "rgba(16, 185, 129, 0.15)" : "rgba(156, 163, 175, 0.15)",
                      color: slot.isInViewport ? "#34d399" : "#9ca3af",
                      border: `1px solid ${slot.isInViewport ? "rgba(16, 185, 129, 0.3)" : "rgba(156, 163, 175, 0.2)"}`,
                    }}
                  >
                    {slot.isInViewport ? "● In Viewport" : "○ Offscreen"}
                  </span>
                </div>

                {/* Details Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "6px",
                    fontSize: "11px",
                    background: "rgba(0, 0, 0, 0.25)",
                    padding: "8px 10px",
                    borderRadius: "6px",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--ad-text-muted)" }}>Format: </span>
                    <span style={{ color: "#fff", fontWeight: 500 }}>{slot.format}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--ad-text-muted)" }}>Size: </span>
                    <span style={{ color: "#fff", fontFamily: "var(--ad-mono)" }}>
                      {Math.round(slot.boundingRect.width)}×{Math.round(slot.boundingRect.height)}px
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--ad-text-muted)" }}>Zero CLS: </span>
                    <span style={{ color: slot.hasClsProtection ? "#10b981" : "#f59e0b", fontWeight: 500 }}>
                      {slot.hasClsProtection ? "✓ Protected" : "⚠ Unreserved"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--ad-text-muted)" }}>Client: </span>
                    <span style={{ color: "#cbd5e1", fontFamily: "var(--ad-mono)", fontSize: "10px" }}>
                      {slot.clientId ? `${slot.clientId.slice(0, 10)}...` : "Inherited"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      slot.element.scrollIntoView({ behavior: "smooth", block: "center" });
                      onHighlightSlot(slot.id);
                    }}
                    style={{
                      flex: 1,
                      background: "rgba(59, 130, 246, 0.15)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "6px",
                      color: "#93c5fd",
                      padding: "6px 10px",
                      fontSize: "11px",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <span>📍 Scroll to Slot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      console.log("[AdInject DevTools] Inspected slot DOM element:", slot.element);
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--ad-border)",
                      borderRadius: "6px",
                      color: "var(--ad-text-muted)",
                      padding: "6px 10px",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                    title="Log DOM element to browser console"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
