# Conduit8

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/conduit8)](https://www.npmjs.com/package/conduit8)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Built on Cloudflare](https://img.shields.io/badge/Built%20on-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://www.cloudflare.com/)
[![CI](https://github.com/conduit8/conduit8/actions/workflows/ci.yml/badge.svg)](https://github.com/conduit8/conduit8/actions/workflows/ci.yml)

Curated registry of agent capabilities for Claude Code. Install, manage, and discover in one command.

**20+ Claude Skills available** - Delivered as installable skills.

## 🚀 Quick Start

```bash
# Search available skills
npx conduit8 search skills

# Install a skill
npx conduit8 install skill pdf

# List installed skills
npx conduit8 list skills

# Remove a skill
npx conduit8 remove skill pdf
```

## What is conduit8?

Discover and install agent capabilities for Claude Code without the GitHub hunt:

- **Better Discovery** - Search by keyword, category, and usage stats
- **One-Command Install** - Skills install directly to `~/.claude/skills/`
- **Zero Config** - Works immediately, no restart needed

## How It Works

1. **Search** - Browse 20+ skills: `npx conduit8 search skills`
2. **Install** - Download to Claude Code: `npx conduit8 install skill <name>`
3. **Use** - Available immediately, no restart needed
4. **Manage** - List or remove anytime

Skills install to `~/.claude/skills/` and work automatically.

## 📦 Available Skills

20+ agent skills across multiple categories:

- **Content** - Brand voice enforcement, email conversion, viral content
- **Data** - CSV analysis, research synthesis
- **Development** - Zero-to-production deployment, security auditing
- **Marketing** - SEO optimization, landing pages
- **Business** - Pitch deck psychology
- **Creative** - Algorithmic art, canvas design, web app testing

All production-ready and tested.

## 🛠️ Development Setup

**For Conduit8 maintainers only.**

### GitHub Packages Authentication

The monorepo uses `@conduit8/core` private package from GitHub Packages.

**Setup:**
1. Create GitHub token with `read:packages` scope: https://github.com/settings/tokens/new
2. Add to `~/.npmrc`:
   ```bash
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```
   Or set environment variable:
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

**Package Access (Admin Only):**
If granting repo access to the package:
1. Go to https://github.com/orgs/conduit8/packages/npm/core/settings
2. Under "Manage Actions access" → Add Repository
3. Add `conduit8/conduit8` with **Read** permission

**CI/CD Note:**
- `ci.yml` requires `permissions: packages: read` and `GITHUB_TOKEN` env var
- Package must grant access to the repository for Actions to install dependencies

### Environment Variables

**CLI:** Copy `apps/cli/.env.example` to `apps/cli/.env`
- `CONDUIT8_API_URL` - Override API URL for local platform development

**Web:** Copy `apps/web/.env.example` to `apps/web/.env.local`
- Required: `VITE_BASE_URL`, `VITE_TURNSTILE_SITE_KEY`
- Optional (for production): `VITE_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `VITE_PUBLIC_POSTHOG_KEY`

### Build & Test

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

## 🤝 Contributing

Contributions from the community are highly appreciated!

### Submit a Skill

**Two submission methods** (both go through the same review process):

1. **Web UI (Recommended)** - Visit https://conduit8.dev, click "Submit", upload your skill ZIP
   - Real-time validation (size, frontmatter, name uniqueness)
   - Instant feedback on errors
   - No git/GitHub knowledge required

2. **GitHub PR** - For those who prefer the git/GitHub workflow
   - Fork repo, add skill to `/skill-submissions/`
   - Open PR with skill submission template
   - See [CONTRIBUTING.md](CONTRIBUTING.md) for details

**All submissions require:**
- `SKILL.md` with valid frontmatter (name, description)
- File size under 50MB
- Testing with Claude Code before submission

See [CONTRIBUTING.md](CONTRIBUTING.md) for complete guidelines, SKILL.md format, and review process.

### Other Contributions

- **Bug reports:** Use our [issue templates](https://github.com/conduit8/conduit8/issues/new/choose)
- **Feature requests:** Suggest improvements via GitHub issues
- **Code contributions:** See development setup below and [CONTRIBUTING.md](CONTRIBUTING.md)

## License

AGPL-3.0
