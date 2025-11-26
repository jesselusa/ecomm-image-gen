# Authentication

The application uses Supabase Auth for user authentication.

## Supported Methods
1.  **Google OAuth**: Enabled via `signInWithOAuth`. Requires Google Cloud Console setup.
2.  **Email/Password**: Enabled via `signUp` and `signInWithPassword`.

## Key Components
- **`app/login/page.tsx`**: The main entry point for authentication.
- **`components/auth/auth-form.tsx`**: Handles the form logic for both OAuth and Email auth.
- **`lib/supabase/middleware.ts`**: Protects routes under `/dashboard`.
- **`app/dashboard/account/page.tsx`**: Allows users to manage their account (sign out, delete).

## Configuration
Ensure your `.env.local` has:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (For admin operations like deletion)

## User Profile Sync
A Postgres trigger (`handle_new_user`) automatically creates a `public.profiles` row whenever a new user is created in `auth.users`. This ensures we always have a profile to attach credits and other data to.

