import { useCallback, useState } from "react";
import type { AdFormat, InjectedAdPlacement, MockTheme } from "../types";
import { getElementLocationContext, getTargetFilePath } from "../utils/route-detector";

export function useVisualInjector() {
  const [isInjectingMode, setIsInjectingMode] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<AdFormat>("fluid");
  const [selectedTheme, setSelectedTheme] = useState<MockTheme>("tech");
  const [placements, setPlacements] = useState<InjectedAdPlacement[]>([]);

  const startInjectMode = useCallback((format: AdFormat = "fluid", theme: MockTheme = "tech") => {
    setSelectedFormat(format);
    setSelectedTheme(theme);
    setIsInjectingMode(true);
  }, []);

  const stopInjectMode = useCallback(() => {
    setIsInjectingMode(false);
  }, []);

  const addPlacement = useCallback(
    (targetEl: HTMLElement, targetDesc: string, format: AdFormat, theme: MockTheme) => {
      // Prevent inserting inside existing ad frames or devtools
      if (
        targetEl.closest("#adinject-devtools-root") ||
        targetEl.closest(".adinject-slot-frame") ||
        targetEl.closest(".adinject-live-injected-container") ||
        targetEl.closest(".adinject-mock-ad-card")
      ) {
        return;
      }

      const id = `injected-placement-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const minHeight = format === "horizontal" ? 90 : format === "vertical" ? 600 : 250;
      const aspectRatio =
        format === "rectangle"
          ? "300/250"
          : format === "horizontal"
          ? "728/90"
          : format === "vertical"
          ? "160/600"
          : undefined;

      const slot = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
      const { filePath, componentName } = getTargetFilePath(pathname);
      const { contextHint } = getElementLocationContext(targetEl);

      const codeSnippet = `// 📁 In ${filePath} -> inside <${componentName} />
// 📍 ${contextHint}
<AdSenseSlot
  slot="${slot}"
  format="${format}"${aspectRatio ? `\n  dimensions={{ minHeight: ${minHeight}, aspectRatio: "${aspectRatio}" }}` : ""}
/>`;

      const newPlacement: InjectedAdPlacement = {
        id,
        index: placements.length + 1,
        format,
        theme,
        targetSelector:
          targetEl.tagName.toLowerCase() +
          (targetEl.className && typeof targetEl.className === "string"
            ? `.${targetEl.className.split(" ")[0]}`
            : ""),
        targetDescription: targetDesc,
        targetFilePath: filePath,
        contextHint,
        position: "after",
        containerElement: targetEl,
        codeSnippet,
        recommendedProps: {
          slot,
          format,
          minHeight,
          aspectRatio,
        },
      };

      setPlacements((prev) => [...prev, newPlacement]);
      setIsInjectingMode(false);
    },
    [placements.length]
  );

  /**
   * Automatically picks the best, policy-compliant spots on the page
   */
  const autoPickPlacements = useCallback((theme: MockTheme = "tech") => {
    if (typeof document === "undefined") return;

    const pathname = window.location.pathname || "/";
    const { filePath, componentName } = getTargetFilePath(pathname);
    const newPlacements: InjectedAdPlacement[] = [];

    // Helper to create placement
    const createAutoPlacement = (
      targetEl: HTMLElement,
      desc: string,
      format: AdFormat,
      idx: number
    ): InjectedAdPlacement => {
      const minHeight = format === "horizontal" ? 90 : format === "vertical" ? 600 : 250;
      const aspectRatio =
        format === "rectangle"
          ? "300/250"
          : format === "horizontal"
          ? "728/90"
          : undefined;

      const slot = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const { contextHint } = getElementLocationContext(targetEl);

      return {
        id: `auto-placement-${Date.now()}-${idx}`,
        index: idx,
        format,
        theme,
        targetSelector:
          targetEl.tagName.toLowerCase() +
          (targetEl.className && typeof targetEl.className === "string"
            ? `.${targetEl.className.split(" ")[0]}`
            : ""),
        targetDescription: desc,
        targetFilePath: filePath,
        contextHint,
        position: "after",
        containerElement: targetEl,
        codeSnippet: `// 📁 In ${filePath} -> inside <${componentName} />
// 📍 ${contextHint}
<AdSenseSlot
  slot="${slot}"
  format="${format}"${aspectRatio ? `\n  dimensions={{ minHeight: ${minHeight}, aspectRatio: "${aspectRatio}" }}` : ""}
/>`,
        recommendedProps: {
          slot,
          format,
          minHeight,
          aspectRatio,
        },
      };
    };

    // 1. Scan for article paragraphs first
    const paragraphs = Array.from(
      document.querySelectorAll("article p, .adinject-article-body p, .prose p, main p")
    ).filter((p) => {
      if (
        p.closest("#adinject-devtools-root") ||
        p.closest(".adinject-slot-frame") ||
        p.closest(".adinject-live-injected-container") ||
        p.closest(".adinject-mock-ad-card")
      ) {
        return false;
      }
      return (p.textContent?.trim().length || 0) > 30;
    }) as HTMLElement[];

    if (paragraphs.length >= 2) {
      // Best Spot 1: After Paragraph #2 (Post-Intro Prime Zone)
      const p2 = paragraphs[1];
      newPlacements.push(
        createAutoPlacement(
          p2,
          `After Paragraph #2 ("${p2.textContent?.trim().slice(0, 35)}...")`,
          "fluid",
          1
        )
      );

      // Best Spot 2: After Paragraph #5 (Mid-Article Engagement Pause)
      if (paragraphs.length >= 5) {
        const p5 = paragraphs[4];
        newPlacements.push(
          createAutoPlacement(
            p5,
            `After Paragraph #5 ("${p5.textContent?.trim().slice(0, 35)}...")`,
            "rectangle",
            2
          )
        );
      }

      // Best Spot 3: After Paragraph #8
      if (paragraphs.length >= 9) {
        const p8 = paragraphs[7];
        newPlacements.push(
          createAutoPlacement(
            p8,
            `After Paragraph #8 ("${p8.textContent?.trim().slice(0, 35)}...")`,
            "fluid",
            3
          )
        );
      }
    } else {
      // 2. Landing Page / Non-article structure: Find hero & major sections
      const hero = document.querySelector(
        "header, [data-hero], .hero, h1, main > div:first-child"
      ) as HTMLElement | null;

      if (
        hero &&
        !hero.closest("#adinject-devtools-root") &&
        !hero.closest(".adinject-slot-frame")
      ) {
        newPlacements.push(
          createAutoPlacement(hero, "Below Hero / Header Section", "fluid", 1)
        );
      }

      const sections = Array.from(
        document.querySelectorAll("section, [data-section], .grid")
      ).filter(
        (s) =>
          !s.closest("#adinject-devtools-root") &&
          !s.closest(".adinject-slot-frame") &&
          !s.closest(".adinject-live-injected-container") &&
          !s.closest("nav") &&
          !s.closest("footer")
      ) as HTMLElement[];

      if (sections.length > 0) {
        const sec1 = sections[0];
        newPlacements.push(
          createAutoPlacement(
            sec1,
            `Below Section 1 ("${sec1.querySelector("h2, h3")?.textContent?.trim() || "Features"}")`,
            "rectangle",
            newPlacements.length + 1
          )
        );
      }

      if (sections.length > 1) {
        const sec2 = sections[1];
        newPlacements.push(
          createAutoPlacement(
            sec2,
            `Below Section 2 ("${sec2.querySelector("h2, h3")?.textContent?.trim() || "Grid"}")`,
            "horizontal",
            newPlacements.length + 1
          )
        );
      }
    }

    setPlacements(newPlacements);
    setIsInjectingMode(false);
  }, []);

  const removePlacement = useCallback((id: string) => {
    setPlacements((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAllPlacements = useCallback(() => {
    setPlacements([]);
  }, []);

  return {
    isInjectingMode,
    selectedFormat,
    selectedTheme,
    placements,
    startInjectMode,
    stopInjectMode,
    addPlacement,
    autoPickPlacements,
    removePlacement,
    clearAllPlacements,
    setSelectedFormat,
    setSelectedTheme,
  };
}
