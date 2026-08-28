"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAdSlotScanner } from "../hooks/useAdSlotScanner";
import { useContentAnalyzer } from "../hooks/useContentAnalyzer";
import { useDevToolsState } from "../hooks/useDevToolsState";
import { useElementInspector } from "../hooks/useElementInspector";
import { useVisualInjector } from "../hooks/useVisualInjector";
import type { DevToolsConfig } from "../types";
import { DEVTOOLS_CSS } from "../utils/styles";
import { AdInjectDock } from "./AdInjectDock";
import { DevToolsPanel } from "./DevToolsPanel";
import { InjectedLiveAd } from "./InjectedLiveAd";
import { InspectorOverlay } from "./InspectorOverlay";
import { VisualDropZones } from "./VisualDropZones";
import { VisualOverlay } from "./VisualOverlay";

export interface AdInjectDevToolsProps extends DevToolsConfig {
  children?: React.ReactNode;
}

/**
 * AdInjectDevTools
 * Floating visual ad inspector, placement advisor, and interactive visual injector for adinject-react.
 * Automatically active in development (NODE_ENV !== 'production') or when forceEnable is set.
 */
export function AdInjectDevTools({
  forceEnable = false,
  position = "bottom-center",
  viewMode = "bottom-dock",
  defaultTab = "inject",
  initialOverlay = true,
  articleSelector = "article, .adinject-article-body, .prose, main",
  children,
}: AdInjectDevToolsProps) {
  const isEnabled = forceEnable || process.env.NODE_ENV !== "production";
  const [mounted, setMounted] = useState(false);

  const {
    state,
    highlightSlotId,
    setHighlightSlotId,
    toggleOpen,
    openPanel,
    closePanel,
    setActiveTab,
    setPosition,
    setViewMode,
    toggleOverlay,
    setMockTheme,
    setSimulatedRule,
  } = useDevToolsState(position, defaultTab, viewMode);

  const { slots, refreshSlots } = useAdSlotScanner();
  const { analysis, policyAudit } = useContentAnalyzer(articleSelector, slots);

  const {
    isInjectingMode,
    selectedFormat,
    placements,
    startInjectMode,
    stopInjectMode,
    addPlacement,
    autoPickPlacements,
    removePlacement,
    clearAllPlacements,
  } = useVisualInjector();

  const {
    isInspectMode,
    hoveredElement,
    startInspect,
    stopInspect,
  } = useElementInspector((el, desc) => {
    // When an element is clicked in inspect mode, add an ad placement below it
    addPlacement(el, desc, "fluid", state.mockTheme);
    refreshSlots();
    openPanel();
    setActiveTab("inject");
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isEnabled || !mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      <div id="adinject-devtools-root">
        {/* Scoped CSS Injection */}
        <style dangerouslySetInnerHTML={{ __html: DEVTOOLS_CSS }} />

        {/* 1. Visual DOM Bounding Box Overlays */}
        {state.overlayMode && !isInjectingMode && !isInspectMode && (
          <VisualOverlay
            slots={slots}
            highlightSlotId={highlightSlotId}
            onSelectSlot={(slot) => {
              setHighlightSlotId(slot.id);
              openPanel();
              setActiveTab("slots");
            }}
          />
        )}

        {/* 2. Interactive Mouse Hover Inspector */}
        <InspectorOverlay
          isInspectMode={isInspectMode}
          hoveredElement={hoveredElement}
          onCancel={stopInspect}
        />

        {/* 3. Interactive Click-to-Inject Drop Targets */}
        <VisualDropZones
          isActive={isInjectingMode}
          selectedFormat={selectedFormat}
          selectedTheme={state.mockTheme}
          onSelectTarget={(el, desc) => {
            addPlacement(el, desc, selectedFormat, state.mockTheme);
            refreshSlots();
            openPanel();
            setActiveTab("inject");
          }}
          onCancel={stopInjectMode}
        />

        {/* 4. Render Live Injected Mock Ads into DOM */}
        {placements.map((placement) => (
          <InjectedLiveAd
            key={placement.id}
            placement={placement}
            onRemove={(id) => {
              removePlacement(id);
              refreshSlots();
            }}
          />
        ))}

        {/* 5. Floating Dock Toolbar (when panel is closed) */}
        {!state.isOpen && !isInjectingMode && !isInspectMode && (
          <AdInjectDock
            position={state.position}
            slotCount={slots.length + placements.length}
            policyScore={policyAudit.overallScore}
            isInspectActive={isInspectMode}
            isInjectActive={isInjectingMode}
            overlayMode={state.overlayMode}
            onOpenPanel={openPanel}
            onToggleInspect={() => (isInspectMode ? stopInspect() : startInspect())}
            onToggleInject={() => (isInjectingMode ? stopInjectMode() : startInjectMode("fluid", state.mockTheme))}
            onToggleOverlay={toggleOverlay}
            onPositionChange={setPosition}
          />
        )}

        {/* 6. Main DevTools Shell (Bottom Dock / Float / Fullscreen) */}
        {state.isOpen && (
          <DevToolsPanel
            position={state.position}
            activeTab={state.activeTab}
            viewMode={state.viewMode}
            overlayMode={state.overlayMode}
            mockTheme={state.mockTheme}
            slots={slots}
            analysis={analysis}
            policyAudit={policyAudit}
            highlightSlotId={highlightSlotId}
            simulatedInterval={state.simulatedInterval}
            simulatedStartOffset={state.simulatedStartOffset}
            simulatedMaxAds={state.simulatedMaxAds}
            placements={placements}
            isInjectingMode={isInjectingMode}
            selectedFormat={selectedFormat}
            onStartInject={startInjectMode}
            onAutoPick={() => {
              autoPickPlacements(state.mockTheme);
              refreshSlots();
            }}
            onStopInject={stopInjectMode}
            onRemovePlacement={removePlacement}
            onClearAllPlacements={clearAllPlacements}
            onClose={closePanel}
            onTabChange={setActiveTab}
            onPositionChange={setPosition}
            onViewModeChange={setViewMode}
            onToggleOverlay={toggleOverlay}
            onThemeChange={setMockTheme}
            onHighlightSlot={setHighlightSlotId}
            onRefreshSlots={refreshSlots}
            onRuleChange={setSimulatedRule}
          />
        )}
      </div>
    </>
  );
}
