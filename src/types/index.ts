export type AdFormat =
  | "rectangle"
  | "horizontal"
  | "vertical"
  | "fluid"
  | "auto"
  | "custom";

export type DevToolsTab =
  | "inject"
  | "slots"
  | "placement"
  | "policy"
  | "simulator"
  | "mock-ads"
  | "settings";

export type DevToolsViewMode = "bottom-dock" | "float" | "fullscreen";

export type DevToolsPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "bottom-center";

export type MockTheme =
  | "tech"
  | "food"
  | "saas"
  | "ecommerce"
  | "travel"
  | "finance";

export interface DevToolsSlotInfo {
  id: string;
  slotNumber: number;
  slotId: string;
  clientId?: string;
  format: AdFormat | string;
  element: HTMLElement;
  boundingRect: {
    top: number;
    left: number;
    width: number;
    height: number;
    bottom: number;
    right: number;
  };
  isInViewport: boolean;
  minHeight?: string | number;
  aspectRatio?: string;
  hasClsProtection: boolean;
  status: "active" | "lazy" | "unfilled" | "fallback" | "test";
  parentType: "in-article" | "in-feed" | "standalone" | "sidebar" | "unknown";
  a11yLabel?: string;
  domSelector: string;
}

export interface InjectedAdPlacement {
  id: string;
  index: number;
  format: AdFormat;
  theme: MockTheme;
  targetSelector: string;
  targetDescription: string;
  targetFilePath?: string;
  contextHint?: string;
  position: "after" | "before";
  containerElement: HTMLElement | null;
  codeSnippet: string;
  recommendedProps: {
    slot: string;
    format: AdFormat;
    minHeight: number;
    aspectRatio?: string;
  };
}

export interface ContentParagraph {
  index: number;
  wordCount: number;
  charCount: number;
  element: HTMLElement;
  textSnippet: string;
  hasAdAfter: boolean;
  isHeadingAdjacent: boolean;
  isCodeBlockAdjacent: boolean;
  isRecommendedSlot: boolean;
  recommendationReason?: string;
}

export interface ContentAnalysis {
  targetElement: HTMLElement | null;
  containerSelector: string;
  totalWords: number;
  totalParagraphs: number;
  estimatedReadingTimeMin: number;
  detectedAdCount: number;
  adDensityRatio: number;
  avgWordsBetweenAds: number;
  paragraphs: ContentParagraph[];
  optimalInterval: number;
  optimalStartOffset: number;
  recommendations: PlacementRecommendation[];
}

export interface PlacementRecommendation {
  id: string;
  type: "optimal" | "warning" | "tip" | "danger";
  title: string;
  message: string;
  paragraphIndex?: number;
  actionSnippet?: string;
}

export interface PolicyCheck {
  id: string;
  name: string;
  description: string;
  status: "pass" | "warning" | "fail";
  score: number;
  details: string;
  remediation?: string;
}

export interface PolicyAuditResult {
  overallScore: number;
  status: "pass" | "warning" | "fail";
  checks: PolicyCheck[];
  totalViolations: number;
  totalWarnings: number;
}

export interface MockCreative {
  id: string;
  theme: MockTheme;
  brand: string;
  tagline: string;
  ctaText: string;
  ctaUrl: string;
  accentColor: string;
  bgGradient: string;
  category: string;
  badge: string;
  imageIcon: string;
}

export interface DevToolsConfig {
  forceEnable?: boolean;
  position?: DevToolsPosition;
  viewMode?: DevToolsViewMode;
  defaultTab?: DevToolsTab;
  initialOverlay?: boolean;
  articleSelector?: string;
}
