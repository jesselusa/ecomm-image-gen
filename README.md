# Palette

A Next.js application for generating high-quality e-commerce product images using Google Gemini "Nano Banana" AI.

## Features
- **AI Image Generation**: Transform product photos with text prompts.
- **Secure Storage**: Private image hosting with Supabase.
- **Credit System**: Stripe-integrated pay-per-use model.
- **Auth**: Google Single Sign-On.

## Setup

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   GOOGLE_API_KEY=...
   STRIPE_SECRET_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   STRIPE_WEBHOOK_SECRET=...
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Deployment
Deploy to Vercel. Ensure all environment variables are set in the project settings.

## Architecture
See `AGENTS.md` for architectural decisions and `workflow/` for development processes.
