# PRD: Authentication System

## Introduction
This PRD defines the authentication system for the E-Comm Image Gen App. It focuses on enabling secure, low-friction user access via Google OAuth AND Email/Password, integrated with Supabase. This system is the gateway for all subsequent features (uploading, generating, paying).

## Goals
- Enable users to sign in/sign up using their Google account OR Email/Password.
- Automatically create and maintain a synced user profile in the database.
- Secure protected routes (`/dashboard`) from unauthorized access.
- Provide a seamless user experience with minimal redirects.
- Allow users to delete their accounts.

## User Stories
1. **Sign In**: As a user, I want to sign in with Google OR my email so I can choose my preferred method.
2. **Auto-Registration**: As a new user, I want my account created automatically upon first login.
3. **Session Persistence**: As a user, I want to stay logged in even if I refresh the page or close the tab.
4. **Protected Access**: As a user, I expect to be redirected to the login page if I try to access the dashboard without being signed in.
5. **Logout**: As a user, I want to securely log out of my account.
6. **Account Deletion**: As a user, I want to be able to delete my account and all associated data.
7. **Dedicated Login Page**: As a user, I want a clean, dedicated page for signing in.

## Functional Requirements

### 1. Authentication Methods
- **Providers**:
    - Google OAuth (via Supabase Auth).
    - Email/Password (Supabase Auth).
- **UI**: 
    - Dedicated `/login` page.
    - "Sign in with Google" button.
    - Email/Password Form (Sign Up & Sign In tabs/toggle).

### 2. User Profile Management
- **Database Table**: `profiles` (linked to `auth.users`).
- **Fields**:
  - `id` (UUID, PK, FK to auth.users)
  - `full_name` (Text)
  - `avatar_url` (Text)
  - `email` (Text)
  - `created_at` (Timestamp)
- **Synchronization**: A Postgres Trigger (`on_auth_user_created`) must automatically insert a row into `profiles` using metadata from Google (Name, Picture) or default values for Email/Password users.

### 3. Session Handling
- **Technology**: `@supabase/ssr` for Next.js App Router (Cookie-based).
- **Middleware**:
  - Intercept requests to `/dashboard/*`.
  - Verify valid Supabase session.
  - Redirect unauthenticated users to `/login`.
  - Refresh expired tokens automatically.

### 4. Account Management
- **Account Page**: `/dashboard/account`
- **Deletion**:
    - Button to delete account.
    - Requires confirmation (modal).
    - Deletes `auth.users` record (cascades to `profiles`, `generations`, etc.).

### 5. Redirect Flow
- **Login Success**: Redirect to `/dashboard`.
- **Login Failure**: Show error message on Login Page.
- **Logout**: Redirect to `/login`.

## Non-Goals
- Multi-factor authentication (MFA).
- Social providers other than Google.
- Password reset flow (MVP: reliance on Supabase default handling/Google).

## Technical Considerations
- **Supabase Keys**: Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL`.
- **Environment**: Ensure Google Cloud Console is configured with the correct Redirect URI (`https://[project].supabase.co/auth/v1/callback`).
- **RLS**: The `profiles` table must have Row Level Security enabled.
- **Deletion**: Use `supabase.auth.admin.deleteUser` (Server-side, admin client) OR `rpc` function to allow self-deletion if `auth.uid() = id`.

## Success Metrics
- Users can successfully sign up via both Google and Email.
- Users can successfully delete their accounts.
- Unauthorized access attempts to `/dashboard` are blocked.
