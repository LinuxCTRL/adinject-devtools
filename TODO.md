# TODO — adinject-devtools

This document tracks upcoming tasks, improvements, and adjustments for `adinject-devtools`.

---

## 🛠️ Phase 1: Package Configuration & Documentation Alignment (Completed)

- [x] **1.1 Add test script to `package.json`**
  - Added `"test": "bun test"` to `scripts` in `package.json`.
- [x] **1.2 Add repository & npm metadata in `package.json`**
  - Added `"repository"`, `"homepage"`, and `"bugs"` URLs pointing to `LinuxCTRL/adinject-devtools`.
- [x] **1.3 Synchronize `AGENTS.md`**
  - Updated `AGENTS.md` with `bun test` instructions and directory architecture map.

---

## 🧪 Phase 2: Testing & Validation Expansion

- [ ] **2.1 Component Render & SSR Guard Tests**
  - Add tests verifying `<AdInjectDevTools />`:
    - Renders `null` when `NODE_ENV === 'production'` and `forceEnable` is `false`.
    - Renders correctly when `forceEnable={true}` even in production mode.
    - Mounts cleanly without hydration errors.
- [ ] **2.2 Visual Drop Zone & Injection Logic Tests**
  - Add tests for `VisualDropZones` and `useVisualInjector` covering ad format selection and live mock ad mounting.
- [ ] **2.3 AI Prompt Generation Tests**
  - Verify formatting and markdown structure for all 4 supported AI tool prompts (Cursor, Claude Code, Antigravity, GitHub Copilot).

---

## 📦 Phase 3: Bundle Optimization & CI Infrastructure

- [ ] **3.1 Bundle Size Audit**
  - Review embedded SVG icons and mock creative assets in `src/utils/mock-creatives.ts` and UI components to optimize output size.
- [ ] **3.2 GitHub Actions CI Setup**
  - Add a GitHub Actions workflow running `typecheck`, `test`, and `build` on every push / PR.

---

## 🌐 Phase 4: Real-World Integration Smoke Test

- [ ] **4.1 Next.js 14 / 15 / 16 App Router Smoke Test**
  - Verify hot reloading, route changes (`usePathname`), and overlay positioning during page transitions.
- [ ] **4.2 `adinject-react` Context Pairing Verification**
  - Ensure devtools gracefully handles both when `<AdInjectProvider>` is present and when mounted standalone with fallback state.
