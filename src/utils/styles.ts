export const DEVTOOLS_CSS = `
#adinject-devtools-root {
  --ad-bg-canvas: #09090b;
  --ad-bg-panel: #111114;
  --ad-bg-sidebar: #0d0d10;
  --ad-bg-card: #18181c;
  --ad-bg-card-hover: #202026;
  --ad-border: rgba(255, 255, 255, 0.08);
  --ad-border-subtle: rgba(255, 255, 255, 0.04);
  --ad-border-active: rgba(59, 130, 246, 0.5);
  --ad-text: #f4f4f5;
  --ad-text-muted: #a1a1aa;
  --ad-text-dim: #71717a;
  --ad-primary: #3b82f6;
  --ad-primary-glow: rgba(59, 130, 246, 0.25);
  --ad-accent: #00dc82;
  --ad-accent-glow: rgba(0, 220, 130, 0.25);
  --ad-success: #10b981;
  --ad-warning: #f59e0b;
  --ad-danger: #ef4444;
  --ad-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
  --ad-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;

  font-family: var(--ad-font);
  font-size: 13px;
  line-height: 1.5;
  color: var(--ad-text);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

#adinject-devtools-root *,
#adinject-devtools-root *::before,
#adinject-devtools-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Floating Trigger Toolbar Dock */
.adinject-dock-toolbar {
  position: fixed;
  z-index: 999990;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 8px;
  background: rgba(18, 18, 22, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.adinject-dock-toolbar.pos-bottom-center {
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
}
.adinject-dock-toolbar.pos-bottom-right {
  bottom: 18px;
  right: 20px;
}
.adinject-dock-toolbar.pos-bottom-left {
  bottom: 18px;
  left: 20px;
}
.adinject-dock-toolbar.pos-top-right {
  top: 18px;
  right: 20px;
}
.adinject-dock-toolbar.pos-top-left {
  top: 18px;
  left: 20px;
}

.adinject-dock-toolbar:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 24px var(--ad-primary-glow);
  transform: translateY(-2px);
}
.adinject-dock-toolbar.pos-bottom-center:hover {
  transform: translateX(-50%) translateY(-2px);
}

.adinject-toolbar-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: var(--ad-text-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.adinject-toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.adinject-toolbar-btn.active {
  background: var(--ad-primary-glow);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* DevTools Main Frame Shell */
.adinject-shell-container {
  position: fixed;
  z-index: 999995;
  background: var(--ad-bg-panel);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid var(--ad-border);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.85);
  display: flex;
  overflow: hidden;
  animation: adinject-slide-up 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Bottom Dock View Mode */
.adinject-shell-container.mode-bottom-dock {
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 520px;
  max-height: 80vh;
  border-bottom: none;
  border-radius: 18px 18px 0 0;
  border-left: none;
  border-right: none;
}

/* Floating Window View Mode */
.adinject-shell-container.mode-float {
  bottom: 24px;
  right: 24px;
  width: 860px;
  max-width: calc(100vw - 48px);
  height: 660px;
  max-height: calc(100vh - 48px);
  border-radius: 18px;
}

/* Fullscreen View Mode */
.adinject-shell-container.mode-fullscreen {
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  width: calc(100vw - 24px);
  height: calc(100vh - 24px);
  border-radius: 16px;
}

@keyframes adinject-slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Spacious Left Sidebar Rail */
.adinject-sidebar-rail {
  width: 76px;
  background: var(--ad-bg-sidebar);
  border-right: 1px solid var(--ad-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8px;
  flex-shrink: 0;
  user-select: none;
}

.adinject-sidebar-nav-item {
  width: 60px;
  height: 54px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--ad-text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  margin-bottom: 8px;
}

.adinject-sidebar-nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.adinject-sidebar-nav-item.active {
  background: rgba(59, 130, 246, 0.16);
  border-color: rgba(59, 130, 246, 0.35);
  color: #60a5fa;
}

.adinject-sidebar-nav-item.active::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 0 4px 4px 0;
  background: #3b82f6;
}

.adinject-sidebar-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 9px;
  font-weight: 700;
  background: #3b82f6;
  color: #fff;
  padding: 1px 5px;
  border-radius: 9999px;
  line-height: 12px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

/* Header Sub-bar inside Shell */
.adinject-header-subbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(14, 14, 18, 0.6);
  border-bottom: 1px solid var(--ad-border);
  flex-shrink: 0;
}

/* Subtle, Polished Page Overlay Indicators */
.adinject-overlay-box {
  position: absolute;
  pointer-events: none;
  z-index: 999980;
  border: 1.5px dashed rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.03);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.adinject-overlay-box.highlighted {
  border-color: #10b981;
  border-style: solid;
  background: rgba(16, 185, 129, 0.08);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.adinject-overlay-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.35);
  font-family: var(--ad-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Hover Mouse Element Inspector Box */
.adinject-inspector-box {
  position: absolute;
  pointer-events: none;
  z-index: 999985;
  border: 2px solid #00dc82;
  background: rgba(0, 220, 130, 0.08);
  border-radius: 6px;
  box-shadow: 0 0 0 3px rgba(0, 220, 130, 0.2), 0 8px 24px rgba(0, 220, 130, 0.12);
  transition: all 0.08s ease-out;
}

.adinject-inspector-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  background: #121215;
  border: 1px solid #00dc82;
  border-radius: 6px;
  padding: 4px 8px;
  color: #00dc82;
  font-family: var(--ad-mono);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Live Injected Mock Ad Container on Page */
.adinject-live-injected-container {
  margin: 28px auto;
  width: 100%;
  max-width: 1100px;
  position: relative;
  border-radius: 12px;
  animation: adinject-fade-in 0.25s ease;
  box-sizing: border-box;
  padding: 0 16px;
}

@keyframes adinject-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.adinject-injected-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f172a;
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  padding: 6px 12px;
  font-size: 11px;
  color: #94a3b8;
}

.adinject-drop-zone-btn {
  width: 100%;
  max-width: 1100px;
  margin: 12px auto;
  padding: 12px 16px;
  border: 1.5px dashed rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.05);
  border-radius: 10px;
  color: #93c5fd;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease;
  user-select: none;
  box-sizing: border-box;
}

.adinject-drop-zone-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: #60a5fa;
  transform: scale(1.005);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  color: #fff;
}

.adinject-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.adinject-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
.adinject-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 3px;
}
.adinject-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.22);
}
`;
