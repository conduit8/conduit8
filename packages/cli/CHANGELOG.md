# Changelog

All notable changes to the conduit8 CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2025-10-20

### Fixed
- **Critical**: Corrected production API URL from `conduit8.com` to `conduit8.dev`
  - v0.6.0 was broken in production due to incorrect API endpoint
  - All API calls now properly route to production backend

### Changed
- Enhanced npm discoverability with additional keywords:
  - `claude code`, `claude-code-skills`, `skill-manager`
  - `anthropic`, `developer-tools`, `productivity`

### Added
- "Issues & Contributing" section in README
- Link to GitHub repository for bug reports and feature requests
- `publish:prod:no-git` script for publishing without git checks

### Removed
- WIP warning from README - package is production ready

## [0.6.0] - 2025-10-20

### Added
- Initial public release
- Search skills from registry: `npx conduit8 search skills [query]`
- Install skills: `npx conduit8 install skill <name>`
- List installed skills: `npx conduit8 list skills`
- Remove installed skills: `npx conduit8 remove skill <name>`
- Support for personal (`~/.claude/skills`) and project (`./.claude/skills`) installation
- Force reinstall option with `--force` flag
- Production API integration with conduit8.dev backend
- Download tracking for skill analytics

### Features
- Zero-installation usage via `npx`
- Automatic skill extraction from R2 storage
- Progress spinners for better UX
- Colorized terminal output
- Detailed installation success messages with examples
- YAML frontmatter parsing for skill metadata

[0.7.0]: https://github.com/alexander-zuev/conduit8/compare/cli-v0.6.0...cli-v0.7.0
[0.6.0]: https://github.com/alexander-zuev/conduit8/releases/tag/cli-v0.6.0
