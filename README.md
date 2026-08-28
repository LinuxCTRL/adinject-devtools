# adinject-devtools

[![npm version](https://img.shields.io/npm/v/adinject-devtools?style=flat-square&color=CB3837&logo=npm)](https://www.npmjs.com/package/adinject-devtools)
[![npm downloads](https://img.shields.io/npm/dm/adinject-devtools?style=flat-square&color=blue&logo=npm)](https://www.npmjs.com/package/adinject-devtools)
[![npm total downloads](https://img.shields.io/npm/dt/adinject-devtools?style=flat-square&color=green&logo=npm)](https://www.npmjs.com/package/adinject-devtools)
[![Companion For adinject-react](https://img.shields.io/badge/Companion%20For-adinject--react-blue?style=flat-square&logo=npm)](https://www.npmjs.com/package/adinject-react)
[![GitHub](https://img.shields.io/badge/GitHub-LinuxCTRL%2Fadinject--devtools-181717?style=flat-square&logo=github)](https://github.com/LinuxCTRL/adinject-devtools)
[![TypeScript](https://img.shields.io/badge/typescript-strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14--16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success?style=flat-square)](https://www.npmjs.com/package/adinject-devtools)
[![MIT License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

> **Visual Ad Inspector, Point & Click Placement Designer & Zero-CLS Policy Auditor for [`adinject-react`](https://www.npmjs.com/package/adinject-react).**  
> Inspect ad slots in real time, visually point-and-click to place mock ads on any section of your page, audit Better Ads compliance, and export copy-paste ready Next.js JSX code & AI prompts.

---

## ⚡ Quick Start

### 1. Install as a dev dependency

```bash
npm install --save-dev adinject-devtools
# or
bun add -d adinject-devtools
```

### 2. Add to your Root Layout (`app/layout.tsx`)

```tsx
import { AdInjectProvider } from "adinject-react";
import { AdInjectDevTools } from "adinject-devtools";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdInjectProvider client="ca-pub-1234567890123456">
          {children}
          {/* Automatically only runs in development (NODE_ENV !== 'production') */}
          <AdInjectDevTools />
        </AdInjectProvider>
      </body>
    </html>
  );
}
```

---

## 🚀 DevTools Capabilities

### 1. 🎛️ Floating Dock Toolbar (`AdInjectDock`)
- Positioned at **bottom-center** (or bottom-right).
- **Quick Action Toolbar**:
  - `🎯 Inspect`: Activates mouse hover element inspection.
  - `➕ Inject`: Launches visual point & click placement mode.
  - `👁 Overlay`: Toggles live page DOM bounding box outlines.
  - `4 Ads`: Live active slot counter badge.
  - `98%`: Better Ads & Zero-CLS compliance score.
  - `⤢ Open`: Expands the full DevTools shell.

### 2. 🎯 Point & Click Visual Ad Designer
- Click any ad format (**In-Article Fluid**, **Medium Rectangle 300×250**, **Leaderboard 728×90**, **Skyscraper 160×600**).
- Interactive drop zones (`+ Click to Inject Ad Here`) appear between paragraphs, below heroes, and across content grids.
- Clicking any spot **instantly mounts a live mock ad** into the webpage DOM with full zero-CLS reservations and controls.

### 3. ✨ 1-Click Auto-Pick Best Places
- Automatically analyzes article paragraphs, reading flow, and section layout to place high-CTR ads with zero CLS layout shifts.

### 4. 🤖 1-Click AI Prompt Generator
- Generates structured Markdown prompts with exact target file paths, component names, and DOM anchors formatted for **Cursor, Claude Code, Antigravity, and GitHub Copilot**.

### 5. 🔍 Live Element Hover Inspector
- Move your cursor across any element on the webpage.
- Displays live glowing outline, element tag, word count, and one-click **"Click to Place Ad"** action.

### 6. 🖥️ Multi-Mode View Shell
- **Bottom Dock Mode**: Slides up from bottom of viewport.
- **Floating Window Mode**: Drag/place in any corner of the screen.
- **Fullscreen Mode**: Full distraction-free monetization studio.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> | Toggle DevTools Drawer Open / Closed |
| <kbd>Esc</kbd> | Cancel Inspect Mode / Close Drawer |

---

## 🛠️ Configuration Props (`<AdInjectDevTools />`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `forceEnable` | `boolean` | `false` | Force DevTools to render even in production builds. |
| `position` | `"bottom-center" \| "bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-center"` | Position of the floating toolbar. |
| `viewMode` | `"bottom-dock" \| "float" \| "fullscreen"` | `"bottom-dock"` | Initial layout view mode. |
| `defaultTab` | `"inject" \| "slots" \| "placement" \| "policy" \| "simulator" \| "mock-ads"` | `"inject"` | Active tab when opening the drawer. |
| `initialOverlay` | `boolean` | `true` | Show visual bounding box overlays on page load. |
| `articleSelector` | `string` | `"article, .adinject-article-body, .prose, main"` | CSS selector used to scan article body text for density analysis. |

---

## 📄 License

MIT © LinuxCTRL
