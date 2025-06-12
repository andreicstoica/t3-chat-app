# Authentication Implementation Guide

## Todo List

- [x] **Setup Better Auth** - [Better Auth Installation Guide](https://www.better-auth.com/docs/installation)
  - Configured better-auth with Drizzle adapter
  - Added GitHub OAuth provider
  - Added email/password authentication

- [ ] **Add Login and Logout API Routes**
  - Create catch-all API route handler for `/api/auth/*`
  - Handle authentication requests

- [ ] **Create Auth Client Instance**
  - Set up client-side authentication utilities
  - Configure auth client for React components

- [ ] **Display User Auth Status in Layout**
  - Show current user status in Layout.tsx
  - Add login/logout buttons based on auth state

- [ ] **Add Auth Status to Chatbot Handlers**
  - Log user authentication status in request handlers
  - Access user session in chatbot API routes

- [ ] **Generate Database Tables**
  - Run Better Auth CLI to create required database tables
  - Apply migrations for auth schema

## Notes
- Using T3 stack with Next.js App Router
- Database: PostgreSQL with Drizzle ORM
- Auth providers: GitHub OAuth + Email/Password 