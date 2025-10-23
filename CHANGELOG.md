# Changelog - Conduit8 Platform

All notable changes to the Conduit8 platform (web + worker) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note:** For CLI changelog, see [packages/cli/CHANGELOG.md](packages/cli/CHANGELOG.md)

## [Unreleased]

### Added
- R2 asset upload script for images and videos (`scripts/upload-r2-assets.sh`)
- Support for uploading skill preview images and videos to production and preview R2 buckets

### Fixed
- Production R2 bucket missing images and videos causing 404 errors on skill cards
- Wrangler R2 upload script now correctly targets remote buckets with `--remote` flag

## [0.1.0] - 2025-10-22

### Added
- Initial release
- Skill ingestion pipeline with AI categorization
- User authentication with Better Auth
- Rate limiting with Durable Objects
- Background job processing with Cloudflare Queues
- D1 database with Drizzle ORM
- R2 storage for skill packages and media
- Sentry error tracking integration
