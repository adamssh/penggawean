# Supabase Integration Plan

This plan outlines the steps to replace `localStorage` with Supabase PostgreSQL, add user authentication, and secure the application data.

## User Review Required

- **Supabase Credentials**: You will need to create a Supabase project and provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` file before the application can function.
- **Data Migration**: Existing tasks in `localStorage` will not be automatically migrated to the cloud for this iteration. This means you will start with a fresh task list once you log in.

## Proposed Changes

### Database Migration
#### [NEW] `supabase_migration.sql`
- Creates the `tasks` table with a foreign key to `auth.users`.
- Enables Row Level Security (RLS) policies using `auth.uid()`.

### Supabase Client Setup
#### [NEW] `src/lib/supabase.ts`
- Initializes the Supabase client using environment variables.

### State Management Refactoring
#### [NEW] `src/store/useAuthStore.ts`
- Manages user sessions, login, registration, and logout states.
- Listens to `onAuthStateChange`.
#### [MODIFY] `src/store/useTaskStore.ts`
- Removes `zustand/middleware/persist` (local storage).
- Replaces local mutations with async API calls to Supabase (`select`, `insert`, `update`, `delete`).
- Includes a data mapper to convert PostgreSQL timestamps (timestamptz) to the application's expected Unix timestamps (numbers).

### UI & Protected Routes
#### [NEW] `src/components/AuthPage.tsx`
- A dedicated login/register page displayed when a user is not authenticated.
#### [NEW] `src/components/AuthHeader.tsx`
- A top-right header component showing the logged-in user's email and a logout button.
#### [MODIFY] `src/App.tsx`
- Conditionally renders `AuthPage` if the user is unauthenticated (Protected Route).
#### [MODIFY] `src/components/DesktopDashboard.tsx`
- Integrates `AuthHeader` into the top right corner.
#### [MODIFY] `src/components/MobileLayout.tsx`
- Integrates `AuthHeader` or a simplified logout mechanism.

## Verification Plan

### Manual Verification
1. Open the app; verify it redirects to the `AuthPage`.
2. Register a new user and log in.
3. Verify the main dashboard is accessible.
4. Add, edit, and delete tasks.
5. Log out, log in with a different user, and verify tasks are isolated per user (testing RLS).
