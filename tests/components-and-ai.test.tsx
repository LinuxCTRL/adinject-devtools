import { describe, expect, it } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  AdInjectDevTools,
  AdInjectDock,
  InjectedLiveAd,
  VisualDropZones,
} from "../src/index";
import { MockAdCanvas } from "../src/components/MockAdCanvas";
import type { InjectedAdPlacement } from "../src/types";
import { getTargetFilePath } from "../src/utils/route-detector";

describe("AdInject DevTools — Component SSR & Guarding", () => {
  it("renders children safely during SSR without hydration or DOM crash", () => {
    const html = renderToString(
      <AdInjectDevTools>
        <div id="app-content">Main Application Content</div>
      </AdInjectDevTools>
    );

    expect(html).toContain("Main Application Content");
    expect(html).toContain('id="app-content"');
  });

  it("suppresses DevTools root DOM elements during SSR initial mount", () => {
    const html = renderToString(
      <AdInjectDevTools>
        <main>Blog Post Body</main>
      </AdInjectDevTools>
    );

    expect(html).toContain("Blog Post Body");
    // Since mounted is initially false during SSR, devtools root is not rendered to avoid hydration mismatches
    expect(html).not.toContain('id="adinject-devtools-root"');
  });

  it("safely handles portal-based components when document is undefined (SSR)", () => {
    const mockPlacement: InjectedAdPlacement = {
      id: "placement-ssr",
      targetSelector: "p",
      targetDescription: "After paragraph",
      contextHint: "Inside body",
      format: "rectangle",
      theme: "tech",
      creative: {
        id: "c-1",
        brand: "HyperScale Cloud",
        headline: "Deploy in 30 Seconds",
        ctaText: "Start Free Trial",
        badgeText: "Sponsored",
        theme: "tech",
        aspectRatio: "300x250",
      },
      codeSnippet: '<AdSenseSlot slot="test-1" />',
      timestamp: Date.now(),
    };

    // In SSR (no document/DOM), portal components return null gracefully
    const liveAdHtml = renderToString(
      <InjectedLiveAd placement={mockPlacement} onRemove={() => {}} />
    );
    expect(liveAdHtml).toBe("");

    const dropZonesHtml = renderToString(
      <VisualDropZones
        isActive={true}
        selectedFormat="fluid"
        selectedTheme="saas"
        onSelectTarget={() => {}}
        onCancel={() => {}}
      />
    );
    expect(dropZonesHtml).toBe("");
  });
});

describe("AdInject DevTools — Dock & Mock Canvas UI Components", () => {
  it("renders AdInjectDock with slot count and policy score badges", () => {
    const html = renderToString(
      <AdInjectDock
        position="bottom-center"
        slotCount={3}
        policyScore={98}
        isInspectActive={false}
        isInjectActive={false}
        overlayMode={true}
        onOpenPanel={() => {}}
        onToggleInspect={() => {}}
        onToggleInject={() => {}}
        onToggleOverlay={() => {}}
        onPositionChange={() => {}}
      />
    );

    expect(html).toContain("AdInject");
    expect(html).toContain("Inspect");
    expect(html).toContain("Inject");
    expect(html).toContain("3");
    expect(html).toContain("Ads");
    expect(html).toContain("98");
  });

  it("renders MockAdCanvas across various ad formats", () => {
    // 1. Leaderboard (horizontal)
    const horizHtml = renderToString(
      <MockAdCanvas format="horizontal" theme="tech" slotIndex={0} />
    );
    expect(horizHtml).toContain("adinject-mock-ad-leaderboard");
    expect(horizHtml).toContain("HyperScale Cloud");

    // 2. Medium Rectangle (300x250)
    const rectHtml = renderToString(
      <MockAdCanvas format="rectangle" theme="food" slotIndex={0} />
    );
    expect(rectHtml).toContain("adinject-mock-ad-card");
    expect(rectHtml).toContain("Artisan Kitchen Co.");

    // 3. Skyscraper (vertical)
    const vertHtml = renderToString(
      <MockAdCanvas format="vertical" theme="finance" slotIndex={0} />
    );
    expect(vertHtml).toContain("adinject-mock-ad-skyscraper");
    expect(vertHtml).toContain("ApexWealth Portfolio");

    // 4. In-Article Fluid
    const fluidHtml = renderToString(
      <MockAdCanvas format="fluid" theme="ecommerce" slotIndex={0} />
    );
    expect(fluidHtml).toContain("AeroGlide Runner");
  });
});

describe("AdInject DevTools — AI Prompt Generation Templates", () => {
  it("formats structured Markdown AI prompts with file paths and JSX anchors", () => {
    const routeInfo = getTargetFilePath("/blog/react-monetization-guide");
    expect(routeInfo.filePath).toBe("src/app/blog/[slug]/page.tsx");
    expect(routeInfo.componentName).toBe("BlogPostPage");

    const samplePlacement: InjectedAdPlacement = {
      id: "ai-p1",
      targetSelector: "article > p:nth-of-type(3)",
      targetDescription: "After 3rd paragraph",
      contextHint: "Between article text paragraphs",
      format: "fluid",
      theme: "tech",
      creative: {
        id: "c-tech-1",
        brand: "CloudHost Pro",
        headline: "High Performance Hosting",
        ctaText: "Learn More",
        badgeText: "Sponsored",
        theme: "tech",
        aspectRatio: "fluid",
      },
      codeSnippet: `<AdSenseSlot
  slot="in-article-ad-1"
  format="fluid"
  responsive={true}
  className="my-8 w-full"
/>`,
      timestamp: Date.now(),
    };

    // Construct markdown prompt matching VisualInjectorTab template
    const fullAiPrompt = `Please update my Next.js file to inject ad monetization slots using \`adinject-react\`.

### 📁 Target File
\`${routeInfo.filePath}\` (Route: "/blog/react-monetization-guide", Component: \`<${routeInfo.componentName} />\`)

### 📦 Required Import
Add this import at the top of \`${routeInfo.filePath}\`:
\`\`\`tsx
import { AdSenseSlot } from "adinject-react";
\`\`\`

### 📍 Ad Placements to Insert
1. **Placement #1 (${samplePlacement.format.toUpperCase()})**
   - **Target Anchor**: ${samplePlacement.contextHint}
   - **JSX Snippet**:
\`\`\`tsx
${samplePlacement.codeSnippet}
\`\`\`

### 🎯 Instructions for AI
- Keep all existing JSX and layout structure intact.
- Insert each \`<AdSenseSlot />\` at the specified location with appropriate vertical spacing (e.g. \`className="my-6 w-full"\`).
- Preserve the exact \`dimensions\` prop to guarantee Zero Cumulative Layout Shift (Zero CLS).`;

    expect(fullAiPrompt).toContain("src/app/blog/[slug]/page.tsx");
    expect(fullAiPrompt).toContain("BlogPostPage");
    expect(fullAiPrompt).toContain('import { AdSenseSlot } from "adinject-react";');
    expect(fullAiPrompt).toContain("in-article-ad-1");
    expect(fullAiPrompt).toContain("Zero Cumulative Layout Shift");
  });
});
