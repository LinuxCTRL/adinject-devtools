import type React from "react";
import { useState } from "react";
import type {
  AdFormat,
  ContentAnalysis,
  DevToolsPosition,
  DevToolsSlotInfo,
  DevToolsTab,
  DevToolsViewMode,
  InjectedAdPlacement,
  MockTheme,
  PolicyAuditResult,
} from "../types";
import { MockAdsTab } from "./MockAdsTab";
import { PlacementAdvisor } from "./PlacementAdvisor";
import { PolicyAuditor } from "./PolicyAuditor";
import { RuleSimulator } from "./RuleSimulator";
import { SlotsInspector } from "./SlotsInspector";
import { VisualInjectorTab } from "./VisualInjectorTab";

interface DevToolsPanelProps {
  position: DevToolsPosition;
  activeTab: DevToolsTab;
  viewMode: DevToolsViewMode;
  overlayMode: boolean;
  mockTheme: MockTheme;
  slots: DevToolsSlotInfo[];
  analysis: ContentAnalysis;
  policyAudit: PolicyAuditResult;
  highlightSlotId: string | null;
  simulatedInterval: number;
  simulatedStartOffset: number;
  simulatedMaxAds: number;
  placements: InjectedAdPlacement[];
  isInjectingMode: boolean;
  selectedFormat: AdFormat;
  onStartInject: (format: AdFormat, theme: MockTheme) => void;
  onAutoPick: () => void;
  onStopInject: () => void;
  onRemovePlacement: (id: string) => void;
  onClearAllPlacements: () => void;
  onClose: () => void;
  onTabChange: (tab: DevToolsTab) => void;
  onPositionChange: (pos: DevToolsPosition) => void;
  onViewModeChange: (mode: DevToolsViewMode) => void;
  onToggleOverlay: () => void;
  onThemeChange: (theme: MockTheme) => void;
  onHighlightSlot: (slotId: string | null) => void;
  onRefreshSlots: () => void;
  onRuleChange: (rule: { interval: number; startOffset: number; maxAds: number }) => void;
}

export function DevToolsPanel({
  position,
  activeTab,
  viewMode,
  overlayMode,
  mockTheme,
  slots,
  analysis,
  policyAudit,
  highlightSlotId,
  simulatedInterval,
  simulatedStartOffset,
  simulatedMaxAds,
  placements,
  isInjectingMode,
  selectedFormat,
  onStartInject,
  onAutoPick,
  onStopInject,
  onRemovePlacement,
  onClearAllPlacements,
  onClose,
  onTabChange,
  onPositionChange,
  onViewModeChange,
  onToggleOverlay,
  onThemeChange,
  onHighlightSlot,
  onRefreshSlots,
  onRuleChange,
}: DevToolsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const navItems: {
    id: DevToolsTab;
    label: string;
    icon: string;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: "inject",
      label: "Visual",
      icon: "🎯",
      badge: placements.length > 0 ? placements.length : undefined,
      badgeColor: "#3b82f6",
    },
    {
      id: "slots",
      label: "Slots",
      icon: "🔍",
      badge: slots.length > 0 ? slots.length : undefined,
      badgeColor: "#00dc82",
    },
    {
      id: "placement",
      label: "Advisor",
      icon: "🧠",
      badge: "AI",
      badgeColor: "#8b5cf6",
    },
    {
      id: "policy",
      label: "Policy",
      icon: "🛡️",
      badge: `${policyAudit.overallScore}%`,
      badgeColor: policyAudit.overallScore >= 90 ? "#10b981" : "#f59e0b",
    },
    {
      id: "simulator",
      label: "Sandbox",
      icon: "⚡",
    },
    {
      id: "mock-ads",
      label: "Studio",
      icon: "🎨",
    },
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case "inject":
        return "Visual Click-to-Inject Designer";
      case "slots":
        return `Active Ad Slots (${slots.length})`;
      case "placement":
        return "Placement Advisor & Content Density";
      case "policy":
        return `Policy & Zero-CLS Audit (${policyAudit.overallScore}/100)`;
      case "simulator":
        return "Interactive Paragraph Interval Simulator";
      case "mock-ads":
        return "Creative Mockup Studio";
      default:
        return "AdInject DevTools";
    }
  };

  return (
    <div className={`adinject-shell-container mode-${viewMode} pos-${position}`}>
      {/* 1. Left Sidebar Rail */}
      <div className="adinject-sidebar-rail">
        {/* Top Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #00dc82 0%, #3b82f6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 800,
              color: "#09090b",
              boxShadow: "0 0 16px rgba(0, 220, 130, 0.3)",
              marginBottom: "16px",
            }}
          >
            A
          </div>

          {/* Nav Items */}
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`adinject-sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => onTabChange(item.id)}
                title={item.label}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span style={{ fontSize: "10px", fontWeight: 600, opacity: isActive ? 1 : 0.8, marginTop: "2px" }}>
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span
                    className="adinject-sidebar-badge"
                    style={{ background: item.badgeColor || "#3b82f6" }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Rail Controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            className="adinject-sidebar-nav-item"
            onClick={onToggleOverlay}
            title={overlayMode ? "Hide DOM overlays" : "Show DOM overlays"}
            style={{ width: "34px", height: "34px", color: overlayMode ? "#00dc82" : "var(--ad-text-dim)" }}
          >
            <span>👁</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header Subbar */}
        <div className="adinject-header-subbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
              {getTabTitle()}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontFamily: "var(--ad-mono)",
                background: "rgba(59, 130, 246, 0.12)",
                color: "#93c5fd",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                padding: "2px 6px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>adinject-react</span>
            </span>
            <span
              style={{
                fontSize: "10px",
                fontFamily: "var(--ad-mono)",
                background: "rgba(255, 255, 255, 0.06)",
                color: "var(--ad-text-muted)",
                padding: "2px 6px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
            >
              {typeof window !== "undefined" ? window.location.pathname : "/"}
            </span>
          </div>

          {/* Right Action Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* View Mode Switcher: Bottom Dock, Floating Window, Fullscreen */}
            <div
              style={{
                display: "flex",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                padding: "2px",
                border: "1px solid var(--ad-border)",
              }}
            >
              <button
                type="button"
                onClick={() => onViewModeChange("bottom-dock")}
                title="Dock to Bottom"
                style={{
                  background: viewMode === "bottom-dock" ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  color: viewMode === "bottom-dock" ? "#fff" : "var(--ad-text-muted)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Dock
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("float")}
                title="Floating Window"
                style={{
                  background: viewMode === "float" ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  color: viewMode === "float" ? "#fff" : "var(--ad-text-muted)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Float
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("fullscreen")}
                title="Fullscreen"
                style={{
                  background: viewMode === "fullscreen" ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  color: viewMode === "fullscreen" ? "#fff" : "var(--ad-text-muted)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Full
              </button>
            </div>

            {/* Position Picker (for Float mode) */}
            {viewMode === "float" && (
              <select
                value={position}
                onChange={(e) => onPositionChange(e.target.value as DevToolsPosition)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--ad-border)",
                  borderRadius: "6px",
                  color: "var(--ad-text-muted)",
                  fontSize: "11px",
                  padding: "4px 6px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title="Close DevTools (ESC)"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid var(--ad-border)",
                borderRadius: "8px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ad-text-muted)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div
          className="adinject-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            background: "var(--ad-bg-canvas)",
          }}
        >
          {activeTab === "inject" && (
            <VisualInjectorTab
              placements={placements}
              isInjectingMode={isInjectingMode}
              selectedFormat={selectedFormat}
              selectedTheme={mockTheme}
              onStartInject={onStartInject}
              onAutoPick={onAutoPick}
              onStopInject={onStopInject}
              onRemovePlacement={onRemovePlacement}
              onClearAll={onClearAllPlacements}
              onThemeChange={onThemeChange}
            />
          )}

          {activeTab === "slots" && (
            <SlotsInspector
              slots={slots}
              highlightSlotId={highlightSlotId}
              onHighlightSlot={onHighlightSlot}
              onRefresh={onRefreshSlots}
            />
          )}

          {activeTab === "placement" && (
            <PlacementAdvisor analysis={analysis} slots={slots} />
          )}

          {activeTab === "policy" && <PolicyAuditor audit={policyAudit} />}

          {activeTab === "simulator" && (
            <RuleSimulator
              analysis={analysis}
              initialInterval={simulatedInterval}
              initialStartOffset={simulatedStartOffset}
              initialMaxAds={simulatedMaxAds}
              onRuleChange={onRuleChange}
            />
          )}

          {activeTab === "mock-ads" && (
            <MockAdsTab
              currentTheme={mockTheme}
              onThemeChange={onThemeChange}
              onInjectAd={(format, theme) => {
                onStartInject(format, theme);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
