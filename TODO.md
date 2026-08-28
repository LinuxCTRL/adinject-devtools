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

## 🧪 Phase 2: Testing & Validation Expansion (Completed)

- [x] **2.1 Component Render & SSR Guard Tests**
  - Added tests in `tests/components-and-ai.test.tsx` verifying SSR rendering safety, production suppression, and portal handling.
- [x] **2.2 Visual Drop Zone & Mock Canvas Tests**
  - Added tests for `MockAdCanvas` across Leaderboard (728x90), Medium Rectangle (300x250), Skyscraper (160x600), and In-Article Fluid formats.
- [x] **2.3 AI Prompt Generation Tests**
  - Added tests validating structured AI Markdown prompts (Cursor, Claude Code, Antigravity, GitHub Copilot) with anchors, filepaths, and Zero-CLS specifications.

---

## 📦 Phase 3: Bundle Optimization & Build Validation (Completed)

- [x] **3.1 Bundle Size Audit**
  - Verified clean builds with `tsup` producing tree-shakable CJS & ESM outputs with zero runtime dependencies.
- [x] **3.2 Local Validation Pipeline**
  - Configured fast local verification via `bun test` and `bun run typecheck`.

---

## 🌐 Phase 4: Real-World Integration Smoke Test (Completed)

- [x] **4.1 Next.js 14 / 15 / 16 App Router Smoke Test**
  - Verified full production build and compilation with Next.js 16 (Turbopack), React 19, and Clerk in `adinject`.
- [x] **4.2 `adinject-react` Context Pairing Verification**
  - Verified seamless integration when mounted inside `<ThemeProvider>` and `<RootLayout>` with zero layout shifts or hydration warnings.

