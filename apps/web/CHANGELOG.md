# Changelog - Conduit8 Platform

All notable changes to the Conduit8 platform (web + worker) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note:** For CLI changelog, see [packages/cli/CHANGELOG.md](packages/cli/CHANGELOG.md)

## [Unreleased]

## [0.2.0] - 2025-10-26

### Added
- **Skill submission system** - Community members can now submit skills directly through the platform
- **Admin review panel** - Curators can approve or reject submissions with detailed feedback
- Skills are published to the public collection after approval

### Improved
- Submission validation with clear error messages and category filtering
- Real-time submission status tracking (pending, approved, rejected)

## [0.1.1] - 2025-10-24

### Fixed
- Videos now load progressively as you scroll instead of all at once (fixes Safari iOS issues)
- Reduced bandwidth usage and improved page load performance

## [0.1.0] - 2025-10-22

### Added
- Initial release
- Skill ingestion pipeline with AI categorization
- User authentication with Better Auth
- Rate limiting with Durable Objects
- Background job processing with Cloudflare Queues
- D1 database with Drizzle ORM
- R2 storage for skill packages and media
