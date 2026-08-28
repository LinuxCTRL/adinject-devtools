import { useCallback, useEffect, useState } from "react";
import type { DevToolsPosition, DevToolsTab, DevToolsViewMode, MockTheme } from "../types";

const STORAGE_KEY = "adinject_devtools_state_v2";

interface StoredState {
  isOpen: boolean;
  activeTab: DevToolsTab;
  position: DevToolsPosition;
  viewMode: DevToolsViewMode;
  overlayMode: boolean;
  mockTheme: MockTheme;
  isMockModeActive: boolean;
  forcedConsent: "auto" | "granted" | "denied";
  simulatedInterval: number;
  simulatedStartOffset: number;
  simulatedMaxAds: number;
}

const DEFAULT_STATE: StoredState = {
  isOpen: false,
  activeTab: "inject",
  position: "bottom-center",
  viewMode: "bottom-dock",
  overlayMode: true,
  mockTheme: "tech",
  isMockModeActive: true,
  forcedConsent: "auto",
  simulatedInterval: 3,
  simulatedStartOffset: 1,
  simulatedMaxAds: 4,
};

export function useDevToolsState(
  initialPosition: DevToolsPosition = "bottom-center",
  initialTab: DevToolsTab = "inject",
  initialViewMode: DevToolsViewMode = "bottom-dock"
) {
  const [state, setState] = useState<StoredState>(() => {
    if (typeof window === "undefined") {
      return {
        ...DEFAULT_STATE,
        position: initialPosition,
        activeTab: initialTab,
        viewMode: initialViewMode,
      };
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage errors
    }
    return {
      ...DEFAULT_STATE,
      position: initialPosition,
      activeTab: initialTab,
      viewMode: initialViewMode,
    };
  });

  const [highlightSlotId, setHighlightSlotId] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore
    }
  }, [state]);

  // Keyboard shortcut listener (Cmd+Shift+A or Ctrl+Shift+A)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
      } else if (e.key === "Escape" && state.isOpen) {
        setState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen]);

  const toggleOpen = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const openPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closePanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const setActiveTab = useCallback((tab: DevToolsTab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const setPosition = useCallback((position: DevToolsPosition) => {
    setState((prev) => ({ ...prev, position }));
  }, []);

  const setViewMode = useCallback((viewMode: DevToolsViewMode) => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  const toggleOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, overlayMode: !prev.overlayMode }));
  }, []);

  const toggleMockMode = useCallback(() => {
    setState((prev) => ({ ...prev, isMockModeActive: !prev.isMockModeActive }));
  }, []);

  const setMockTheme = useCallback((mockTheme: MockTheme) => {
    setState((prev) => ({ ...prev, mockTheme }));
  }, []);

  const setForcedConsent = useCallback((forcedConsent: "auto" | "granted" | "denied") => {
    setState((prev) => ({ ...prev, forcedConsent }));
  }, []);

  const setSimulatedRule = useCallback(
    (rule: { interval?: number; startOffset?: number; maxAds?: number }) => {
      setState((prev) => ({
        ...prev,
        simulatedInterval: rule.interval ?? prev.simulatedInterval,
        simulatedStartOffset: rule.startOffset ?? prev.simulatedStartOffset,
        simulatedMaxAds: rule.maxAds ?? prev.simulatedMaxAds,
      }));
    },
    []
  );

  return {
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
    toggleMockMode,
    setMockTheme,
    setForcedConsent,
    setSimulatedRule,
  };
}
