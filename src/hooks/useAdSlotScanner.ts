import { useCallback, useEffect, useState } from "react";
import type { AdFormat, DevToolsSlotInfo } from "../types";

export function useAdSlotScanner() {
  const [slots, setSlots] = useState<DevToolsSlotInfo[]>([]);

  const scanSlots = useCallback(() => {
    if (typeof document === "undefined") return;

    // Look for all ad slots rendered by adinject-react or raw Google AdSense tags
    const frameElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".adinject-slot-frame, ins.adsbygoogle, .adinject-infeed-card, [data-ad-slot]"
      )
    ).filter((el) => !el.closest("#adinject-devtools-root"));

    // Deduplicate nested elements (e.g. ins inside .adinject-slot-frame)
    const uniqueElements: HTMLElement[] = [];
    frameElements.forEach((el) => {
      const parentFrame = el.closest(".adinject-slot-frame") as HTMLElement | null;
      if (parentFrame && parentFrame !== el) {
        if (!uniqueElements.includes(parentFrame)) {
          uniqueElements.push(parentFrame);
        }
      } else if (!uniqueElements.includes(el)) {
        uniqueElements.push(el);
      }
    });

    const detectedSlots: DevToolsSlotInfo[] = uniqueElements.map((el, index) => {
      const insTag = el.querySelector("ins.adsbygoogle") || (el.tagName === "INS" ? el : null);
      const slotId =
        el.getAttribute("data-ad-slot") ||
        insTag?.getAttribute("data-ad-slot") ||
        `slot-${index + 1}`;

      const clientId =
        el.getAttribute("data-ad-client") ||
        insTag?.getAttribute("data-ad-client") ||
        undefined;

      const format = (el.getAttribute("data-ad-format") ||
        insTag?.getAttribute("data-ad-format") ||
        "fluid") as AdFormat;

      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      const minHeight = style.minHeight !== "0px" ? style.minHeight : undefined;
      const aspectRatio = style.aspectRatio !== "auto" ? style.aspectRatio : undefined;
      const hasClsProtection = Boolean(minHeight || aspectRatio);

      const isInViewport =
        rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0 && rect.height > 0;

      // Determine parent type
      let parentType: DevToolsSlotInfo["parentType"] = "standalone";
      if (el.closest(".adinject-article-body") || el.closest("article")) {
        parentType = "in-article";
      } else if (el.closest(".adinject-infeed-card") || el.closest("[data-feed-item]")) {
        parentType = "in-feed";
      } else if (el.closest("aside") || el.closest(".sidebar")) {
        parentType = "sidebar";
      }

      // Check status
      let status: DevToolsSlotInfo["status"] = "active";
      if (el.querySelector(".adinject-fallback-banner")) {
        status = "fallback";
      } else if (el.textContent?.includes("Google AdSense Test Slot")) {
        status = "test";
      } else if (insTag && insTag.getAttribute("data-adsbygoogle-status") === "unfilled") {
        status = "unfilled";
      }

      return {
        id: `adinject-slot-${slotId}-${index}`,
        slotNumber: index + 1,
        slotId,
        clientId,
        format,
        element: el,
        boundingRect: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom + window.scrollY,
          right: rect.right + window.scrollX,
        },
        isInViewport,
        minHeight,
        aspectRatio,
        hasClsProtection,
        status,
        parentType,
        a11yLabel: el.getAttribute("aria-label") || undefined,
        domSelector: el.tagName.toLowerCase() + (el.className ? `.${el.className.split(" ").join(".")}` : ""),
      };
    });

    setSlots(detectedSlots);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    scanSlots();

    // Re-scan on window resize or scroll
    const handleScrollOrResize = () => {
      scanSlots();
    };

    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });

    // Mutation observer for dynamically rendered slots
    const observer = new MutationObserver(() => {
      scanSlots();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "data-adsbygoogle-status"],
    });

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize);
      observer.disconnect();
    };
  }, [scanSlots]);

  return { slots, refreshSlots: scanSlots };
}
