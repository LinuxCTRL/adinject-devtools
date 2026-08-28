export { AdInjectDevTools, type AdInjectDevToolsProps } from "./components/AdInjectDevTools";
export { AdInjectDock } from "./components/AdInjectDock";
export { InspectorOverlay } from "./components/InspectorOverlay";
export { MockAdCanvas } from "./components/MockAdCanvas";
export { DevToolsPanel } from "./components/DevToolsPanel";
export { VisualOverlay } from "./components/VisualOverlay";
export { VisualDropZones } from "./components/VisualDropZones";
export { InjectedLiveAd } from "./components/InjectedLiveAd";
export { VisualInjectorTab } from "./components/VisualInjectorTab";
export { SlotsInspector } from "./components/SlotsInspector";
export { PlacementAdvisor } from "./components/PlacementAdvisor";
export { PolicyAuditor } from "./components/PolicyAuditor";
export { RuleSimulator } from "./components/RuleSimulator";
export { MockAdsTab } from "./components/MockAdsTab";

export { useAdSlotScanner } from "./hooks/useAdSlotScanner";
export { useContentAnalyzer } from "./hooks/useContentAnalyzer";
export { useDevToolsState } from "./hooks/useDevToolsState";
export { useElementInspector } from "./hooks/useElementInspector";
export { useVisualInjector } from "./hooks/useVisualInjector";

export { analyzeContent, runPolicyAudit, countWords } from "./utils/ad-density";
export { MOCK_CREATIVES, getMockCreative } from "./utils/mock-creatives";

export type {
  AdFormat,
  DevToolsTab,
  DevToolsViewMode,
  DevToolsPosition,
  MockTheme,
  DevToolsSlotInfo,
  InjectedAdPlacement,
  ContentParagraph,
  ContentAnalysis,
  PlacementRecommendation,
  PolicyCheck,
  PolicyAuditResult,
  MockCreative,
  DevToolsConfig,
} from "./types";
