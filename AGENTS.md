# Palette

This document serves as the source of truth for architectural decisions, development patterns, and operational procedures.

## Architecture & Decisions

### D001: Core Tech Stack

**Date:** November 26, 2025
**Decision:** Next.js (App Router) + Supabase + Vercel

- **Next.js:** Industry standard, SEO friendly, easy Vercel deployment.
- **Supabase:** All-in-one backend (Auth, DB, Storage, Realtime).
- **Vercel:** Seamless deployment for Next.js.

### D002: UI/UX & Design System

**Date:** November 26, 2025
**Decision:** ShadCN UI + Tailwind CSS + DM Sans Font

- **Inspiration:** Shopify, Photoroom, Etsy (Minimalist, high-conversion).
- **ShadCN:** Accessible, customizable, copy-paste components.
- **Tailwind:** Rapid styling, mobile-first.
- **DM Sans:** Clean, modern sans-serif font that works well for e-commerce interfaces.

### D003: State Management

**Date:** November 26, 2025
**Decision:** React Context + Hooks

- Start simple. Complexity (Zustand/Redux) will only be added if prop drilling becomes unmanageable.

### D004: Storage Policy

**Date:** November 26, 2025
**Decision:** Private vs Public Buckets

- **User Uploads & Generated Images:** Private buckets (authenticated access only).
- **Site Assets:** Public bucket.
- **Rationale:** User data privacy is paramount.

### D005: Usage Limits (MVP)

**Date:** November 26, 2025
**Decision:** Hybrid Free/Paid Model with Rate Limiting

- **Free Tier:** 1 image per week.
- **Rate Limit:** Hard cap of 20 images/day per user to prevent cost runaways.
- **Rationale:** Control API costs while allowing trial usage.

### D006: AI Model

**Date:** November 26, 2025
**Decision:** Google Gemini "Nano Banana" (gemini-2.5-flash-image)

- **Rationale:** High quality, cost-effective, good for image-to-image tasks.

### D007: Payment Provider

**Date:** November 26, 2025
**Decision:** Stripe (Credit-based)

- **Rationale:** Users pay per generation (credits) rather than subscription, better alignment with usage.

### D008: Authentication Strategy

**Date:** November 26, 2025
**Decision:** Hybrid Auth (Google OAuth + Email/Password)

- **Rationale:** Maximize accessibility. Users can choose quick OAuth or traditional email signup. Account deletion is supported for compliance.

---

## Development Guidelines

### Environment & Setup

- **Package Manager:** `npm`
- **Install Dependencies:** `npm install`
- **Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Format/Lint:** `npm run lint`

### ShadCN Components

- **Add Component:** `npx shadcn@latest add <component-name>`
- Always check `components/ui` before creating a custom atomic component.

### Database & Supabase

- **Migrations:** Managed via Supabase Dashboard (SQL Editor) or migrations folder (if set up).
- **Types:** Run `npx supabase gen types typescript --project-id <id> > lib/database.types.ts` to update types (if CLI is configured).
- **RLS:** Always enable RLS on new tables. Default to `auth.uid() = user_id`.

### Testing Instructions

- **Manual Verification:** Use the browser to test critical flows (Auth, Payment, Generation).
- **Browser Tools:** Use Cursor's browser tools to snapshot and verify UI states.
- **Stripe Testing:** Use `stripe listen` to forward webhooks locally.

### PR Instructions

- **Title Format:** `feat: <feature-name>` or `fix: <bug-description>`
- **Pre-Commit:** Ensure `npm run build` passes locally.
- **Files:** Remove unused imports and temporary test files before pushing.

### UI/UX Guidelines

- **Text Formatting:** Use sentence case for all UI text (labels, buttons, headings, etc.).
  - ✅ Correct: "Create your first image", "Source image", "Generate images"
  - ❌ Incorrect: "Create Your First Image", "Source Image", "Generate Images"
- **Exceptions:** Brand names, product names, and proper nouns should maintain their original capitalization.

---

Last Updated: November 27, 2025
