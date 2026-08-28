import { useCallback, useEffect, useState } from "react";

export interface InspectedElementInfo {
  element: HTMLElement;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  tagName: string;
  className: string;
  textSnippet: string;
  wordCount: number;
}

export function useElementInspector(
  onSelectElement?: (element: HTMLElement, description: string) => void
) {
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<InspectedElementInfo | null>(null);

  const startInspect = useCallback(() => {
    setIsInspectMode(true);
  }, []);

  const stopInspect = useCallback(() => {
    setIsInspectMode(false);
    setHoveredElement(null);
  }, []);

  useEffect(() => {
    if (!isInspectMode || typeof window === "undefined") {
      setHoveredElement(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (
        !target ||
        target.closest("#adinject-devtools-root") ||
        target === document.body ||
        target === document.documentElement
      ) {
        setHoveredElement(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const text = target.textContent?.trim() || "";
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

      setHoveredElement({
        element: target,
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        },
        tagName: target.tagName.toLowerCase(),
        className: target.className && typeof target.className === "string" ? target.className.split(" ")[0] : "",
        textSnippet: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
        wordCount: words,
      });
    };

    const handleClick = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (
        !target ||
        target.closest("#adinject-devtools-root") ||
        target === document.body ||
        target === document.documentElement
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const tagName = target.tagName.toLowerCase();
      const text = target.textContent?.trim() || "";
      const desc = text ? `${tagName.toUpperCase()} ("${text.slice(0, 30)}...")` : `<${tagName}> element`;

      onSelectElement?.(target, desc);
      stopInspect();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopInspect();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isInspectMode, onSelectElement, stopInspect]);

  return {
    isInspectMode,
    hoveredElement,
    startInspect,
    stopInspect,
  };
}
