# Technology Stack

## Core Framework
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework

## Database & ORM
- **PostgreSQL** - Primary database
- **Drizzle ORM** - Type-safe database toolkit
- **Drizzle Kit** - Database migrations and introspection

## Authentication
- **Better Auth** - Modern authentication library
- **Google OAuth** - Social authentication provider
- **Email/Password** - Traditional authentication

## AI Integration
- **Vercel AI SDK** - AI/ML integration toolkit
- **OpenAI GPT-4o-mini** - Primary AI model
- **Google Gemini 2.0 Flash** - Alternative AI model

## API & State Management
- **tRPC** - End-to-end typesafe APIs
- **TanStack Query** - Server state management
- **Zod** - Runtime type validation

## UI Components
- **Radix UI** - Headless component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Next Themes** - Theme management

## Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting

## Package Management
- **pnpm** - Fast, disk space efficient package manager

## Common Commands

### Development
```bash
pnpm dev          # Start development server with Turbo
pnpm build        # Build for production
pnpm start        # Start production server
pnpm preview      # Build and start production server
```

### Code Quality
```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm typecheck    # Run TypeScript compiler check
pnpm check        # Run both lint and typecheck
pnpm format:check # Check code formatting
pnpm format:write # Format code with Prettier
```

### Database
```bash
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio
```

## Environment Setup
- Copy `.env.example` to `.env.local`
- Configure database URL, auth secrets, and API keys
- Use `start-database.sh` for local PostgreSQL setup