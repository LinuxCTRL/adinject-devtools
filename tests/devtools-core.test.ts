import { describe, expect, it } from "bun:test";
import { countWords, runPolicyAudit } from "../src/utils/ad-density";
import { MOCK_CREATIVES, getMockCreative } from "../src/utils/mock-creatives";
import { getElementLocationContext, getTargetFilePath } from "../src/utils/route-detector";
import * as PublicExports from "../src/index";

describe("AdInject DevTools — Route & File Path Detector", () => {
  it("resolves root pathname to src/app/page.tsx HomePage", () => {
    const result = getTargetFilePath("/");
    expect(result.filePath).toBe("src/app/page.tsx");
    expect(result.componentName).toBe("HomePage");
    expect(result.isArticle).toBe(false);
  });

  it("resolves dynamic blog post route to [slug]/page.tsx", () => {
    const result = getTargetFilePath("/blog/monetization-guide");
    expect(result.filePath).toBe("src/app/blog/[slug]/page.tsx");
    expect(result.componentName).toBe("BlogPostPage");
    expect(result.isArticle).toBe(true);
  });

  it("resolves dynamic docs route to docs/[slug]/page.tsx", () => {
    const result = getTargetFilePath("/docs/quickstart");
    expect(result.filePath).toBe("src/app/docs/[slug]/page.tsx");
    expect(result.componentName).toBe("DocsPage");
    expect(result.isArticle).toBe(true);
  });

  it("resolves nested dashboard route to (dashboard)/dashboard/...", () => {
    const result = getTargetFilePath("/dashboard/ad-units");
    expect(result.filePath).toBe("src/app/(dashboard)/dashboard/ad-units/page.tsx");
    expect(result.componentName).toBe("DashboardPage");
  });

  it("resolves standard standalone page to src/app/calculator/page.tsx", () => {
    const result = getTargetFilePath("/calculator");
    expect(result.filePath).toBe("src/app/calculator/page.tsx");
    expect(result.componentName).toBe("CalculatorPage");
  });

  it("extracts context hint gracefully when element is null", () => {
    const context = getElementLocationContext(null);
    expect(context.parentContainer).toBe("Page Body");
    expect(context.contextHint).toBe("Inside main JSX return");
  });
});

describe("AdInject DevTools — Content Analysis & Policy Auditor", () => {
  it("accurately counts words in content strings", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
    expect(countWords("Hello world from adinject-devtools!")).toBe(4);
    expect(countWords("AdInject   React   Monetization   Toolkit")).toBe(4);
  });

  it("audits policy compliance and awards 100% score when no violations exist", () => {
    const mockAnalysis = {
      totalWords: 1200,
      totalParagraphs: 8,
      paragraphs: [],
      estimatedReadingTime: 5,
      currentAdSlotsCount: 2,
      adDensityRatio: 0.15,
      isDensitySafe: true,
      recommendations: [],
    };

    const audit = runPolicyAudit(mockAnalysis, [
      {
        id: "slot-1",
        slotNumber: 1,
        slotId: "12345",
        format: "fluid",
        element: {} as HTMLElement,
        boundingRect: { top: 100, left: 0, width: 728, height: 90, bottom: 190, right: 728 },
        isInViewport: true,
        hasClsProtection: true,
        a11yLabel: "Advertisement",
        status: "active",
        parentType: "in-article",
        domSelector: "div",
      },
    ]);

    expect(audit.overallScore).toBeGreaterThanOrEqual(95);
    expect(audit.status).toBe("pass");
    expect(audit.checks.length).toBeGreaterThan(0);
  });
});

describe("AdInject DevTools — Creative Mock Catalog", () => {
  it("contains creatives for all 6 industry themes", () => {
    expect(MOCK_CREATIVES.tech.length).toBeGreaterThan(0);
    expect(MOCK_CREATIVES.saas.length).toBeGreaterThan(0);
    expect(MOCK_CREATIVES.food.length).toBeGreaterThan(0);
    expect(MOCK_CREATIVES.ecommerce.length).toBeGreaterThan(0);
    expect(MOCK_CREATIVES.travel.length).toBeGreaterThan(0);
    expect(MOCK_CREATIVES.finance.length).toBeGreaterThan(0);
  });

  it("retrieves mock creative by theme and cycles index", () => {
    const c1 = getMockCreative("tech", 0);
    expect(c1.brand).toBe("HyperScale Cloud");
    expect(c1.theme).toBe("tech");

    const cFood = getMockCreative("food", 0);
    expect(cFood.brand).toBe("Artisan Kitchen Co.");

    const cFallback = getMockCreative("unknown" as any, 0);
    expect(cFallback).toBeDefined();
    expect(cFallback.brand).toBe("HyperScale Cloud");
  });
});

describe("AdInject DevTools — Package Exports", () => {
  it("exports all necessary components and hooks for adinject-react pairing", () => {
    expect(PublicExports.AdInjectDevTools).toBeDefined();
    expect(PublicExports.AdInjectDock).toBeDefined();
    expect(PublicExports.DevToolsPanel).toBeDefined();
    expect(PublicExports.VisualOverlay).toBeDefined();
    expect(PublicExports.VisualDropZones).toBeDefined();
    expect(PublicExports.InjectedLiveAd).toBeDefined();
    expect(PublicExports.VisualInjectorTab).toBeDefined();
    expect(PublicExports.useAdSlotScanner).toBeDefined();
    expect(PublicExports.useContentAnalyzer).toBeDefined();
    expect(PublicExports.useDevToolsState).toBeDefined();
    expect(PublicExports.useElementInspector).toBeDefined();
    expect(PublicExports.useVisualInjector).toBeDefined();
  });
});
