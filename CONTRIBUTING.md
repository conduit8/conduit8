# Contributing to Conduit8

Thank you for your interest in contributing to Conduit8! We welcome contributions of all kinds.

## Table of Contents

- [Skill Submissions](#skill-submissions)
  - [Path 1: Web UI (Recommended)](#path-1-web-ui-recommended)
  - [Path 2: GitHub PR (Alternative Method)](#path-2-github-pr-alternative-method)
- [SKILL.md Format](#skillmd-format)
- [Review Process](#review-process)
- [Bug Reports & Feature Requests](#bug-reports--feature-requests)
- [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)

## Skill Submissions

### Path 1: Web UI (Recommended)

**Best for:** Most users who want to submit a single skill quickly.

1. Visit https://conduit8.dev
2. Click the "Submit" button in the header
3. Upload your skill package as a ZIP file
4. Select the appropriate category
5. Submit and await review

**Requirements:**
- ZIP file containing `SKILL.md` (+ optional additional files)
- File size under 50MB
- Valid `SKILL.md` frontmatter (see format below)
- Unique skill name (validated automatically)

**Advantages:**
- Real-time validation (size, frontmatter, name uniqueness)
- Instant feedback on errors
- No git/GitHub knowledge required
- Fastest path to submission

### Path 2: GitHub PR (Alternative Method)

**Best for:** Contributors who prefer the git/GitHub workflow.

1. Fork the repository
2. Create a feature branch: `git checkout -b skill/my-awesome-skill`
3. Create your skill directory: `skill-submissions/my-awesome-skill/`
4. Add your `SKILL.md` and any additional files
5. Commit using conventional commits: `feat: add my-awesome-skill`
6. Open a pull request using the skill submission template

**Directory Structure:**
```
skill-submissions/
└── my-awesome-skill/
    ├── SKILL.md          # Required
    ├── example.py        # Optional supporting files
    └── README.md         # Optional additional docs
```

**Why Choose GitHub PR?**
- Prefer git/GitHub workflow over web forms
- More familiar with pull request process
- Want version control of your submission
- Contribution visible in git history

**Note:** Both submission methods support the same skill capabilities and go through identical review processes. GitHub PR does not enable additional features - it's purely a workflow preference.

## SKILL.md Format

Every skill must include a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: My Awesome Skill
description: A brief description of what this skill does (max 500 chars)
license: MIT
allowed-tools: Read, Write, Bash
---

# My Awesome Skill

[Detailed instructions for Claude Code on how to use this skill...]

## Examples

[Usage examples...]

## Notes

[Additional context...]
```

**Required Fields:**
- `name`: Skill name (1-100 characters)
- `description`: Brief description (1-500 characters)

**Optional Fields:**
- `license`: License identifier (e.g., MIT, Apache-2.0, CC-BY-4.0)
- `allowed-tools`: Comma-separated list of tools the skill can use
- `metadata`: Custom key-value pairs for extensibility

**Content Below Frontmatter:**
- Write clear, detailed instructions for Claude Code
- Include examples demonstrating usage
- Explain any prerequisites or limitations
- Use markdown formatting for readability

## Review Process

**Timeline:** Submissions are typically reviewed within 3-5 business days.

**Process:**

1. **Automated Validation** (Web UI only)
   - File size check (< 50MB)
   - Frontmatter parsing and validation
   - Skill name uniqueness verification

2. **Manual Review**
   - Maintainer tests the skill locally
   - Verifies functionality and quality
   - Checks for policy compliance (no malicious code, appropriate content)

3. **Decision**
   - **Approved:** Skill is published to the registry and available via `npx conduit8 install skill <name>`
   - **Rejected:** Feedback provided with specific reasons and suggestions for improvement

**What We Look For:**
- Clear, well-written instructions
- Practical, useful functionality
- No security concerns (code review for suspicious patterns)
- Appropriate category classification
- Quality over quantity (one great skill > ten mediocre ones)

**After Approval:**
- Skill appears in search results: `npx conduit8 search skills`
- Available for installation globally
- Listed on conduit8.dev with download counts and ratings

## Bug Reports & Feature Requests

Found a bug or have an idea? Use our issue templates:

- **Bug Report:** For CLI, platform, or skill issues
- **Feature Request:** For new features or improvements

Visit: https://github.com/conduit8/conduit8/issues/new/choose

**Good Bug Reports Include:**
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, CLI version)
- Error logs or screenshots

**Good Feature Requests Include:**
- Problem description (what pain point this solves)
- Proposed solution
- Alternative approaches considered
- Use cases and examples

## Code Contributions

We welcome code contributions! Areas where help is appreciated:

- Bug fixes
- Performance improvements
- Documentation enhancements
- New CLI features
- Platform improvements

**Before Starting:**
1. Check existing issues and PRs to avoid duplication
2. For major changes, open an issue first to discuss the approach
3. Follow the project's code style and conventions

**Development Workflow:**
1. Fork and clone the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes following our code standards
4. Write/update tests as needed
5. Run tests and linting: `pnpm test && pnpm lint`
6. Commit using conventional commits (see below)
7. Push and open a PR

**Conventional Commits:**
```
feat: add new CLI command for skill stats
fix: resolve issue with skill installation on Windows
docs: update installation instructions
refactor: simplify skill validation logic
test: add tests for skill parser
chore: update dependencies
```

## Development Setup

**For Conduit8 maintainers and contributors working on the codebase.**

See [README.md Development Setup](README.md#-development-setup) for detailed instructions including:
- GitHub Packages authentication
- Environment variables
- Build and test commands

**Quick Start:**
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Run CLI locally
cd apps/cli
pnpm dev
```

## Questions?

- **General questions:** Open a discussion on GitHub
- **Bug reports:** Use the bug report template
- **Feature ideas:** Use the feature request template
- **Security concerns:** Email security@conduit8.dev

Thank you for contributing to Conduit8! 🎉
