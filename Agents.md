# Agent Instructions — ToolMarket.ge

## Role
Act as a senior frontend engineer and UX/UI specialist.

Always review UI changes with a designer’s eye:
- alignment
- spacing
- hierarchy
- typography
- proportions
- responsive behavior
- hover/focus/active/disabled states

## Project
ToolMarket.ge is a Georgian ecommerce platform for:
- tools
- construction materials
- electrical supplies
- technical products

## Design System
Use:
- dark navy / blue
- orange accent
- white
- light gray backgrounds

Brand colors:
- #0B3A68
- #072B4D
- #041C32
- #F58220
- #F7F8FA
- #E5EAF0
- #102033
- #6B7280

Style:
- modern
- clean
- professional
- trustworthy
- ecommerce-first
- Georgian typography
- responsive-first

Avoid:
- clutter
- heavy shadows
- random colors
- emojis
- template-like UI
- unnecessary animations

## Icon Rule
Never use emojis in the UI.

Always use SVG icons:
- lucide-react icons
- existing SVG icons
- inline SVG only if necessary

## Code Style
Prefer small, correct changes.
Reuse existing components, utilities, and patterns.
Avoid unnecessary dependencies and large rewrites.

## Scope Discipline
Focus only on the requested task.

Do not:
- redesign unrelated sections
- refactor unrelated code
- add backend logic unless requested
- add auth/database/payment logic unless requested
- change routes or features outside scope

## Next.js Version Warning
This project uses a recent Next.js version with App Router.

Do not assume older Next.js APIs.
If unsure, check local docs:

node_modules/next/dist/docs/

Pay attention to:
- App Router conventions
- server/client component boundaries
- route handlers
- metadata APIs
- image/font behavior

## Required Verification
After code changes run:

npm run lint
npm run build

Before optional checks, inspect package.json.

If typecheck exists:
npm run typecheck

If tests exist:
npm test
or
npm run test

Do not run Prisma migrations unless explicitly requested.

## Final Response Format
Changed files:
- ...

Fixed:
- ...

Checks:
- npm run lint: passed/failed
- npm run build: passed/failed
- npm run typecheck: passed/failed/not available
- npx prisma generate: passed/failed/not relevant
- tests: passed/failed/not available