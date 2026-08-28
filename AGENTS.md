# AGENTS.md — adinject-devtools

## What this package is

`adinject-devtools` is the companion devtools package for [`adinject-react`](https://www.npmjs.com/package/adinject-react), the headless ad/affiliate injection engine for Next.js (App Router) + React 19. Where `adinject-react` handles the runtime ad-slot logic, this package is a **dev-only visual toolkit**: a floating in-app panel that lets a developer inspect ad slots, place mock ads by pointing and clicking, audit Better Ads / zero-CLS compliance, and export ready-to-paste JSX and AI prompts.

It ships as a single client-side React component (`<AdInjectDevTools />`) that gets mounted once, near the root of the app, inside the existing `<AdInjectProvider>` from `adinject-react`.

Published: npm, `adinject-devtools@1.0.1`, MIT license, author/maintainer `LinuxCTRL`.

## Relationship to adinject-react

- `adinject-react` = required for the app to function; runs in production; provides `<AdInjectProvider>` and the ad-slot primitives.
- `adinject-devtools` = optional; **dev dependency only**; adds nothing to the production runtime by default. It reads/visualizes the state that `adinject-react` manages.
- `adinject-react` is listed as an **optional peer dependency** — the devtools package can theoretically load without it, but it's built to pair with it and most features assume it's present.

Peer dependencies:
```json
"peerDependencies": {
  "adinject-react": ">=1.0.0",
  "react": ">=18.0.0 || >=19.0.0",
  "react-dom": ">=18.0.0 || >=19.0.0"
}
```

## Install

```bash
npm install --save-dev adinject-devtools
# or
bun add -d adinject-devtools
```

Zero runtime dependencies — only `react`/`react-dom` as peers.

## Usage

Mount inside the root layout, nested in the existing `AdInjectProvider`:

```tsx
// app/layout.tsx
import { AdInjectProvider } from "adinject-react";
import { AdInjectDevTools } from "adinject-devtools";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdInjectProvider client="ca-pub-1234567890123456">
          {children}
          {/* Only renders when NODE_ENV !== 'production', unless forceEnable is set */}
          <AdInjectDevTools />
        </AdInjectProvider>
      </body>
    </html>
  );
}
```

The component self-guards against production rendering — an agent should **not** need to wrap it in an `if (process.env.NODE_ENV !== 'production')` check; that's already handled internally.

## Configuration props (`<AdInjectDevTools />`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `forceEnable` | `boolean` | `false` | Force DevTools to render even in production builds. Use with caution — this is an escape hatch, not the default path. |
| `position` | `"bottom-center" \| "bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-center"` | Position of the floating toolbar. |
| `viewMode` | `"bottom-dock" \| "float" \| "fullscreen"` | `"bottom-dock"` | Initial layout view mode. |
| `defaultTab` | `"inject" \| "slots" \| "placement" \| "policy" \| "simulator" \| "mock-ads"` | `"inject"` | Active tab when opening the drawer. |
| `initialOverlay` | `boolean` | `true` | Show visual bounding box overlays on page load. |
| `articleSelector` | `string` | `"article, .adinject-article-body, .prose, main"` | CSS selector used to scan article body text for density analysis. |

## Feature surface (for context, not all directly scriptable)

1. **Floating Dock Toolbar** — bottom-center/right toolbar with Inspect, Inject, Overlay toggle, live ad-slot counter, and a compliance score badge.
2. **Point & Click Visual Ad Designer** — click an ad format (In-Article Fluid, 300×250, 728×90, 160×600) and click a drop zone to mount a live mock ad into the DOM with zero-CLS reservations.
3. **1-Click Auto-Pick Best Places** — analyzes article structure/reading flow to suggest high-CTR, zero-CLS placements.
4. **1-Click AI Prompt Generator** — exports structured Markdown prompts (file paths, component names, DOM anchors) formatted for Cursor, Claude Code, Antigravity, GitHub Copilot.
5. **Live Element Hover Inspector** — hover any element to see tag, word count, and a "place ad here" action.
6. **Multi-mode view shell** — bottom dock, floating window, or fullscreen "monetization studio" mode.

Keyboard shortcuts: `Cmd/Ctrl+Shift+A` toggles the drawer; `Esc` cancels inspect mode / closes the drawer.

## Package internals an agent should know

- **Entry points:** `main` → `./dist/index.js` (CJS), `module` → `./dist/index.mjs` (ESM), `types` → `./dist/index.d.ts`. Standard dual-format export map — no special resolution logic needed.
- **Build tool:** [`tsup`](https://tsup.egoist.dev/). `npm run build` runs `tsup`, then a post-build script that prepends `"use client";` to both `dist/index.js` and `dist/index.mjs` if it isn't already there. **Do not remove this post-build step** — it's what makes the component safe to import into Next.js App Router server-rendered trees.
- **Scripts:**
  - `build` — production build + `"use client"` injection
  - `dev` — `tsup --watch`
  - `test` — `bun test` (runs test suite in `tests/`)
  - `typecheck` — `tsc --noEmit`
  - `clean` — `rm -rf dist`
- **Testing:** Tests are located in `tests/devtools-core.test.ts` and executed with `bun test`.
- **Directory Layout:**
  - `src/components/` — UI components (Dock toolbar, drawer tabs, overlay & inspector)
  - `src/hooks/` — React hooks (slot scanner, content analyzer, element inspector)
  - `src/utils/` — Core utilities (route detection, policy audit engine, mock creatives)
  - `src/types/` — TypeScript declarations and state interfaces
- **Repository:** `https://github.com/LinuxCTRL/adinject-devtools`
- **Unpacked size is ~1MB across 9 files** for a zero-dependency package — larger than typical for a devtools-only bundle. If asked to investigate bundle size, check for embedded assets (icons/fonts/CSS) before assuming code bloat.

## Guardrails for AI agents working in this repo

- This is a **dev-only** tool. Any change that could cause `AdInjectDevTools` to render in a production build by default (bypassing the `NODE_ENV` guard or `forceEnable` opt-in) is a regression — treat it as a breaking change requiring explicit sign-off.
- Keep the package **zero runtime dependencies**. If a change requires adding a new dependency, flag it rather than adding it silently — that's a stated selling point of the package.
- The AI-prompt-generator feature encodes assumptions about Cursor/Claude Code/Copilot prompt conventions. These external formats can drift — if asked to "fix" or "update" this feature, verify current conventions rather than trusting the existing template as ground truth.
- This package's props/behavior are tightly coupled to `adinject-react`'s internal state shape. Changes here that assume a different `adinject-react` version should note the required `adinject-react` peer version bump.

## Status

Version 1.0.0, just published. Treat it as new/unproven in real-world Next.js apps — an agent doing follow-up work should prioritize a real integration smoke test (SSR/hydration behavior, especially) over further feature additions until that's confirmed stable.
