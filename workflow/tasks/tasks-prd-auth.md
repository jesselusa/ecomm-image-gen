# Tasks: Authentication System

## Relevant Files
- `lib/supabase/server.ts` - Supabase Server Client.
- `lib/supabase/client.ts` - Supabase Browser Client.
- `middleware.ts` - Session management and protection.
- `app/auth/callback/route.ts` - OAuth Callback handler.
- `app/login/page.tsx` - Dedicated Login/Sign-up Page.
- `components/auth/auth-form.tsx` - Email/Password + Google Form.
- `app/dashboard/account/page.tsx` - Account Management Page.
- `app/api/auth/delete-account/route.ts` - Account Deletion Handler.

## Tasks

- [ ] 1.0 Configuration & Setup
  - [ ] 1.1 Update `.env.local` with new key names (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`).
  - [ ] 1.2 Configure Supabase Clients (`client.ts`, `server.ts`, `middleware.ts`) to use new env vars.
  - [ ] 1.3 Verify "Email" provider is enabled in Supabase Dashboard (Manual Step).

- [ ] 2.0 Database Synchronization
  - [ ] 2.1 Update `handle_new_user` trigger SQL to handle missing metadata (email signups).
  - [ ] 2.2 Apply migration to update trigger function.

- [ ] 3.0 Auth Implementation (UI)
  - [ ] 3.1 Create `app/login/page.tsx` layout (Centered Card).
  - [ ] 3.2 Create `components/auth/auth-form.tsx` with "Sign In" and "Sign Up" tabs.
  - [ ] 3.3 Implement `signInWithPassword` logic in form.
  - [ ] 3.4 Implement `signUp` logic in form.
  - [ ] 3.5 Implement `signInWithOAuth` (Google) logic in form.
  - [ ] 3.6 Update `app/auth/callback/route.ts` to handle email confirmation links (if enabled) or OAuth redirects.

- [ ] 4.0 Account Management
  - [ ] 4.1 Create `app/dashboard/account/page.tsx` UI (Show profile info).
  - [ ] 4.2 Create `app/api/auth/delete-account/route.ts` using `supabase-admin` client.
  - [ ] 4.3 Add "Delete Account" button to Account page with confirmation dialog.

- [ ] 5.0 Session Management & Middleware
  - [ ] 5.1 Update `middleware.ts` to redirect unauthenticated users to `/login`.
  - [ ] 5.2 Update Landing Page (`app/page.tsx`) "Get Started" link to point to `/login` or `/dashboard` depending on auth state.
