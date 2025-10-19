# Conduit8

> **⚠️ WIP - DO NOT USE YET**
>
> Currently building the backend and curating skills. The CLI is published but not functional yet.

**Curated registry of Claude Code skills**. Kind of like context7 but for Claude Code Skills.

Discover, install, and share Claude Code skills in one command. Better than digging through GitHub.

## Quick Start

```bash
# Search available skills
npx @conduit8/cli search skills

# Install a skill
npx @conduit8/cli install skill pdf

# List installed skills
npx @conduit8/cli list skills

# Remove a skill
npx @conduit8/cli remove skill pdf
```

## What is conduit8?

conduit8 solves the pain of finding quality Claude Code skills:

- **Better Discovery**: Search by keyword, category, usage stats instead of browsing GitHub repos
- **One-Command Install**: Install skills directly to `~/.claude/skills/` via CLI
- **Quality Signals**: Ratings, verification, and usage metrics instead of guessing what works
- **Curated Registry**: Hand-picked, tested skills instead of 10,000+ untested repos

## How It Works

1. **Browse**: Search the registry via CLI or web interface at [conduit8.dev](https://conduit8.dev)
2. **Install**: Run `npx @conduit8/cli install skill <name>` to download and install to Claude Code
3. **Use**: Skills appear in Claude Code immediately - no restart needed
4. **Manage**: List installed skills or remove them anytime

Skills are installed to `~/.claude/skills/` and work with Claude Code automatically.

## Contributing

**Coming Soon**: Currently, the registry includes only official Anthropic skills. Community contributions will be enabled soon.

Stay tuned for the ability to:
- Submit your own skills to the registry
- Get your skills verified and featured
- Help others discover your work

## License

AGPL-3.0
