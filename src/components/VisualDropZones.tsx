import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { AdFormat, MockTheme } from "../types";

interface VisualDropZonesProps {
  isActive: boolean;
  selectedFormat: AdFormat;
  selectedTheme: MockTheme;
  onSelectTarget: (element: HTMLElement, description: string) => void;
  onCancel: () => void;
}

interface CandidateTarget {
  element: HTMLElement;
  description: string;
}

export function VisualDropZones({
  isActive,
  selectedFormat,
  onSelectTarget,
  onCancel,
}: VisualDropZonesProps) {
  const [targets, setTargets] = useState<CandidateTarget[]>([]);

  useEffect(() => {
    if (!isActive || typeof document === "undefined") {
      setTargets([]);
      return;
    }

    // Escape key listener to cancel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Find candidate landing zones across the page
    const found: CandidateTarget[] = [];

    // Helper filter to strictly prevent selecting anything inside devtools or ads
    const isCleanElement = (el: Element): boolean => {
      return !el.closest(
        "#adinject-devtools-root, .adinject-slot-frame, .adinject-live-injected-container, .adinject-mock-ad-card, .adinject-mock-ad-leaderboard, .adinject-mock-ad-skyscraper, .adinject-injected-controls, nav, footer, [data-adinject-ignore]"
      );
    };

    // 1. Article / main content paragraphs
    const paragraphs = Array.from(
      document.querySelectorAll("article p, .prose p, main p, .adinject-article-body p")
    ).filter(isCleanElement);

    paragraphs.forEach((p, idx) => {
      const text = p.textContent?.trim() || "";
      if (text.length > 20) {
        found.push({
          element: p as HTMLElement,
          description: `After Paragraph #${idx + 1} ("${text.slice(0, 35)}...")`,
        });
      }
    });

    // 2. Headings & sections
    const sections = Array.from(
      document.querySelectorAll("section, header, [data-section], .hero, .grid")
    ).filter(isCleanElement);

    sections.forEach((s, idx) => {
      const heading = s.querySelector("h1, h2, h3")?.textContent?.trim();
      found.push({
        element: s as HTMLElement,
        description: heading ? `Below Section "${heading}"` : `After Section #${idx + 1}`,
      });
    });

    // If no specific elements found, target top-level elements under main
    if (found.length === 0) {
      const mainChildren = Array.from(document.querySelectorAll("main > *, body > *")).filter(
        isCleanElement
      );
      mainChildren.forEach((el, idx) => {
        found.push({
          element: el as HTMLElement,
          description: `After Content Block #${idx + 1}`,
        });
      });
    }

    setTargets(found.slice(0, 15)); // Cap at 15 most prominent spots

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, onCancel]);

  if (!isActive || targets.length === 0) return null;

  return (
    <>
      {/* Top Notification Bar */}
      <div className="adinject-injecting-bar">
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#3b82f6",
            boxShadow: "0 0 8px #3b82f6",
            animation: "adinject-pulse 1.5s infinite",
          }}
        />
        <span>
          🎯 Click-to-Inject Active: Choose a spot to place <strong>{selectedFormat.toUpperCase()}</strong> ad
        </span>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "none",
            color: "#fff",
            borderRadius: "9999px",
            padding: "2px 8px",
            fontSize: "10px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ESC to Cancel
        </button>
      </div>

      {/* Render Drop Target Buttons below candidate elements */}
      {targets.map((target, idx) => {
        return createPortal(
          <div
            key={`drop-zone-${idx}`}
            style={{
              width: "100%",
              boxSizing: "border-box",
              margin: "8px 0",
              zIndex: 999950,
              position: "relative",
            }}
          >
            <button
              type="button"
              className="adinject-drop-zone-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTarget(target.element, target.description);
              }}
            >
              <span>+ Click to Inject {selectedFormat.toUpperCase()} Ad Here</span>
              <span style={{ fontSize: "10px", opacity: 0.8, fontWeight: 400 }}>
                ({target.description})
              </span>
            </button>
          </div>,
          target.element.parentElement || document.body
        );
      })}
    </>
  );
}
