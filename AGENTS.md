# AGENTS.md

## Project Context

This repository contains the high-fidelity HTML prototype for the WeChat mini program project `还了么`.

The current deliverable is a browser-runnable prototype built with:

- `index.html`
- `style.css`
- `app.js`
- feature-specific split files such as `js/checkin.js` and `css/checkin.css`

The app should continue to behave like a mobile mini program prototype, not a normal desktop website. The design baseline is iPhone 6 / 375px wide.

Important product documents in this repo:

- `《还了么 PRD V1.0》.md`
- `还了么-产品结构图谱.md`
- `还了么-UI-Design-System-V1.0.md`
- `《还了么 Figma 页面设计规范》.md`
- `交接文档-还了么首页原型.md`
- `还了么-iconfont-图标清单.md`

Reference prototypes and visual materials live in:

- `初版UI/`

## Current Design Direction

Keep the current visual direction unless the user explicitly asks for a redesign.

Style keywords:

- Pale purple and white gradient
- Glassmorphism
- Soft shadows
- Healing, modern, lightweight mini-program feel
- Rounded capsule controls
- Dense but readable information hierarchy
- Real app-like mobile UI

Avoid:

- Financial/bank/loan platform style
- Heavy orange theme
- Strong marketing or sales look
- Flat plain web page layout
- Recreating the Figma plugin workflow

The homepage is currently considered about 70%+ aligned with the user's expectations and should be used as the style baseline for future pages.

## Product Structure

The bottom tabbar has four main tabs:

- 首页
- 报表
- 账本
- 我的

Current prototype routes include:

- 首页
- 出手相助
- 江湖救急
- 约定详情
- 延期申请
- 消息中心
- 个人中心
- 签到中心
- 我的约定列表页
- 信誉中心

Future work should preserve existing business logic and avoid adding unrelated bookkeeping/reporting features to the homepage unless requested.

## Implementation Guidelines

- Keep `index.html` as the mobile shell.
- Keep the prototype directly runnable by opening `index.html` in a browser.
- Prefer incremental feature split files for larger sections:
  - Example: `js/checkin.js`
  - Example: `css/checkin.css`
- Do not move all page markup into `index.html`.
- Do not introduce a build step unless the user explicitly asks.
- Keep code simple HTML + CSS + JavaScript.
- Use stable, readable class names.
- Keep new UI consistent with the current pale purple glass style.

When adding pages or major features:

- Preserve the 375px mobile viewport feel.
- Keep click targets comfortably large.
- Use icon + text where it improves scanning.
- Use horizontal scrolling chips/cards where vertical space becomes crowded.
- Keep cards visually layered but not noisy.
- Avoid page titles at the top unless the user asks for them.

## Current Sign-in Feature Notes

The sign-in feature has been split into:

- `js/checkin.js`
- `css/checkin.css`

Current behavior:

- Homepage sign-in starts as unsigned.
- First tap signs in, adds `+10`, and plays the celebration animation once.
- Returning to homepage after switching tabs or pages must not replay the `+10` animation.
- Tapping the already-signed-in sign-in button opens the sign-in detail page.
- Sign-in detail has three areas:
  - Daily sign-in summary card
  - Swipeable monthly calendar
  - Credit growth and rewards area

Credit level prototype icons:

- `🌱 0+`
- `🍃 100+`
- `⭐ 200+`
- `💎 350+`
- `🏆 500+`
- `👑 700+`

These emoji are placeholders. Replace them with Alibaba iconfont assets only when the user chooses the final icons.

## Git and Publishing Rules

Do not commit, push, or change remote repositories unless the user explicitly asks for it in the current turn.

The user has specifically said:

- Only submit code when they actively ask.
- Do not push automatically.

Known Git context:

- The main working directory may have `origin` pointing to `https://github.com/ikunzp520/codex-repaylo.git`.
- A previous temporary push directory `.push-tmp` pointed to `git@github.com:forever-xyz/repaylo-ui.git`.
- Confirm the intended remote before any publishing work.

If publishing is requested:

- First run `git remote -v` and `git status -sb`.
- Explain which repository and branch will be affected.
- Stage only intended files.
- Do not use destructive Git commands.

## Verification

Run these checks after JavaScript changes:

```bash
node --check app.js
node --check js/checkin.js
```

If a new JavaScript feature file is added, run `node --check` on that file too.

For UI changes, the user often previews manually in the in-app browser or directly from:

```text
file:///C:/Users/Administrator/Desktop/还了么/codex-repaylo/index.html
```

Do not force browser automation if the user says they will preview themselves.

## Collaboration Notes

The user prefers iterative visual refinement:

- First make the page usable.
- Then adjust layout, density, colors, icons, and motion.
- Keep changes focused on the page currently being discussed.

When the user gives visual feedback, prioritize:

- Layout clarity
- Better card hierarchy
- Softer colors
- More helpful icons
- Less empty space
- More app-like interaction

When uncertain, continue the current homepage style rather than inventing a new style.
