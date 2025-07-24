# Project Structure

## Root Directory
- **Configuration files**: `package.json`, `tsconfig.json`, `next.config.js`, `drizzle.config.ts`
- **Environment**: `.env`, `.env.example`, `.env.local` for environment variables
- **Database**: `drizzle/` contains migration files and metadata
- **Scripts**: `start-database.sh` for local database setup

## Source Code Organization (`src/`)

### App Router (`src/app/`)
- **Pages**: Route-based file structure following Next.js App Router conventions
- **API Routes**: `src/app/api/` contains server endpoints
  - `auth/[...all]/` - Better Auth integration
  - `chat/` - AI chat streaming endpoint
  - `save-chat/` - Chat persistence endpoint
  - `trpc/[trpc]/` - tRPC API handler
- **Route Groups**: `chat/`, `signin/`, `signup/` for different app sections

### Components (`src/components/`)
- **Main Components**: Feature-specific React components
- **UI Components**: `src/components/ui/` contains reusable Radix UI-based components
- **Naming**: PascalCase for component files (e.g., `Chat.tsx`, `FileUpload.tsx`)

### Server Logic (`src/server/`)
- **API**: `src/server/api/` contains tRPC router definitions
  - `root.ts` - Main router configuration
  - `trpc.ts` - tRPC setup and middleware
  - `routers/` - Individual route handlers
- **Database**: `src/server/db/` contains database configuration
  - `index.ts` - Database connection
  - `schema.ts` - Drizzle schema definitions
- **Services**: `users.ts` and other business logic

### Libraries (`src/lib/`)
- **Authentication**: `auth.ts`, `auth-client.ts` for Better Auth setup
- **State Management**: `chat-store.ts` for chat-related state
- **Utilities**: `utils.ts` for common helper functions

### Other Directories
- **Hooks**: `src/hooks/` for custom React hooks
- **Styles**: `src/styles/globals.css` for global styles
- **tRPC**: `src/trpc/` for client-side tRPC configuration
- **Environment**: `src/env.js` for environment variable validation

## Naming Conventions
- **Files**: kebab-case for routes, PascalCase for components
- **Database**: Snake_case with table prefixes (`tarot-chat-app_`)
- **API Routes**: RESTful naming in `route.ts` files
- **Components**: Descriptive names reflecting functionality

## Import Patterns
- **Path Alias**: Use `~/` for imports from `src/` directory
- **Relative Imports**: Prefer absolute imports with path alias
- **Type Imports**: Use `type` keyword for type-only imports

## Database Schema
- **Multi-project**: Uses `createTable` with prefixed table names
- **Auth Tables**: `user`, `session`, `account`, `verification` for Better Auth
- **App Tables**: `chats`, `posts` for application data
- **Migrations**: Stored in `drizzle/` directory with sequential numbering