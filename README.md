# Kollektiv

**Collaborative workspace platform powered by AI**

A full-stack application built on Cloudflare's edge infrastructure that enables teams to collaborate on projects with integrated AI assistance through Claude Code SDK.

## Architecture

### Tech Stack

**Edge Layer (Cloudflare Workers)**
- **Framework**: Hono for HTTP routing
- **Runtime**: TypeScript on Cloudflare Workers
- **Infrastructure**: Durable Objects, D1 (SQLite), R2, KV, Queues
- **Container Orchestration**: `@cloudflare/containers` for isolated Claude Code instances
- **Authentication**: Better Auth with OAuth providers
- **Analytics**: PostHog
- **Monitoring**: Sentry

**Web Application (React SPA)**
- **Framework**: React 19 + TypeScript
- **Routing**: TanStack Router
- **State Management**: Zustand + TanStack Query
- **Styling**: Tailwind CSS v4 + Radix UI
- **Design System**: Token-based with Radix Themes foundation
- **Development**: Storybook for component documentation

**Agent Runtime (Python Container)**
- **Framework**: FastAPI on port 8080
- **AI Integration**: Claude Code SDK (`claude-agent-sdk`)
- **Container Runtime**: Docker with Python 3.13
- **Deployment**: Cloudflare Containers (isolated per-user instances)

### Request Flow

```
User → React SPA → Worker (Hono) → Durable Object → Container (FastAPI) → Claude SDK
                      ↓
                   D1/KV/R2/Queues
```

## Project Structure

```
apps/
├── worker/           # Cloudflare Worker (API + edge logic)
│   ├── src/
│   │   ├── domain/          # Business logic, entities
│   │   ├── application/     # Use cases, orchestration
│   │   ├── infrastructure/  # External concerns (DB, auth, runtime)
│   │   └── api/            # HTTP interface, routing
│   └── wrangler.jsonc
│
├── web/              # React SPA
│   ├── src/
│   │   ├── components/      # UI components (atoms, molecules, organisms)
│   │   ├── features/        # Feature-specific components and logic
│   │   ├── layouts/         # Page layouts
│   │   └── styles/          # Design tokens and global styles
│   └── vite.config.ts
│
└── agent-runtime/    # Python container for Claude SDK
    ├── src/
    │   ├── api/            # FastAPI routes
    │   ├── domain/         # Business logic
    │   ├── application/    # Use cases
    │   └── infrastructure/ # External integrations
    ├── Dockerfile
    └── pyproject.toml

packages/
└── core/             # Shared TypeScript types and utilities
```

## Development

### Prerequisites

- **Node.js**: 22 LTS
- **Package Manager**: pnpm
- **Docker**: For building container images
- **Cloudflare Account**: With Workers, D1, R2, and Containers enabled

### Setup

```bash
# Install dependencies
pnpm install

# Generate TypeScript types for Cloudflare bindings
cd apps/worker
pnpm cf-typegen

# Run development server (edge + web)
pnpm dev
```

### Environment Configuration

**Worker Environment Variables** (in `wrangler.jsonc`):
- `ENV`: Environment name (`preview` or `production`)
- `POSTHOG_HOST`: Analytics endpoint
- `BETTER_AUTH_URL`: Authentication base URL
- `SENTRY_RELEASE`: Release version for error tracking

**Container Environment Variables** (set via `ClaudeRuntime` class):
- `ANTHROPIC_API_KEY`: Claude API key (per-user, stored in DO)
- `GH_TOKEN`: GitHub token for repo access (per-user, stored in DO)
- `ENVIRONMENT`: Current environment
- `CWD`: Working directory (`/workspace`)

### Database Workflow

**Supabase is source of truth** - all migrations created in Supabase:

```bash
# Apply migrations to database
supabase db push

# Pull schema and generate TypeScript types
pnpm db:pull
```

**Never create Drizzle migrations** - they conflict with Supabase workflow.

### Testing

```bash
# Run all tests
pnpm test

# Run with verbose output
pnpm test:verbose

# Watch mode
pnpm test:watch

# Unit tests only
pnpm test:unit

# Integration tests only
pnpm test:integration
```

### Deployment

```bash
# Deploy to preview environment
pnpm deploy

# Deploy to production
pnpm deploy:prod
```

**Deploy pipeline**:
1. Type-check TypeScript
2. Build shared core package
3. Bundle worker code
4. Upload source maps to Sentry
5. Deploy to Cloudflare Workers

## Key Features

### Container Isolation

Each user gets their own isolated container instance managed via Durable Objects:
- **Auto-scaling**: Containers sleep after 20 minutes of inactivity
- **State Persistence**: Session data stored in R2, restored on wake
- **Environment Variables**: Per-user API keys stored in Durable Object storage
- **Internet Access**: Enabled for web searches and external API calls

### Authentication

Better Auth integration with:
- Email/password authentication
- OAuth providers (GitHub, Google, etc.)
- Rate limiting via Durable Objects
- Session management with KV storage

### Queue System

Two-tier queue architecture:
- **Priority Queue**: Single-message batches, no timeout (critical operations)
- **Background Queue**: Batched processing, 5s timeout (async work)
- **Dead Letter Queue**: Failed message handling

### Monitoring & Analytics

- **Sentry**: Error tracking and performance monitoring
- **PostHog**: Product analytics and user behavior tracking
- **Cloudflare Analytics**: Built-in observability

## Configuration

### Cloudflare Bindings

**D1 Databases**:
- `D1`: Main SQLite database

**KV Namespaces**:
- `KV`: General key-value storage
- `AUTH_KV`: Authentication session storage

**R2 Buckets**:
- `R2`: Object storage for files and session data

**Durable Objects**:
- `RateLimiterDO`: Rate limiting state
- `ClaudeRuntime`: Container orchestration and state

**Queues**:
- `PRIORITY_QUEUE`: High-priority message processing
- `BACKGROUND_QUEUE`: Async background jobs

### Cron Triggers

- `0 9 * * *`: Daily tasks at 9 AM UTC
- `0 */3 * * *`: Every 3 hours

## Architecture Decisions

### Domain-Driven Design (DDD)

**Layer Dependencies**:
1. **Domain Layer**: Core business logic (no external dependencies)
2. **Application Layer**: Use cases (depends on Domain)
3. **Infrastructure Layer**: External integrations (implements Domain interfaces)
4. **API Layer**: HTTP interface (depends on Application + Domain)

### Dependency Injection

- Constructor injection for explicit dependencies
- Framework-native DI (Hono context, FastAPI dependencies)
- No hidden globals or service locators

### Testing Strategy

- **Quality over quantity**: Focus on critical paths
- **Minimal tests**: 10-15 lines max per test
- **Shared mocks**: Single source of truth for test data
- **Test factories**: Reusable data generation

## Security

- **User Isolation**: Each container is isolated via Durable Objects
- **API Key Storage**: Per-user keys stored in encrypted DO storage
- **Rate Limiting**: Request throttling via Durable Objects
- **Content Security**: Input validation with Zod schemas
- **Session Management**: Secure session handling with Better Auth

## Performance Standards

- **Interaction Response**: < 200ms for core interactions
- **Page Load (FCP)**: < 1.2s
- **Page Load (LCP)**: < 2.5s
- **Bundle Size**: < 250KB compressed
- **API Response (p95)**: < 500ms

## License

Private - all rights reserved
