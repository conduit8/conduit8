# conduit8 CLI

> **⚠️ WIP - DO NOT USE YET**
>
> Backend is still being built. CLI is published but will not work until backend is ready.

Install and manage Claude Code skills from the conduit8 registry. One command to discover, install, and manage skills.

## Quick Start

No installation needed - use `npx`:

```bash
npx @conduit8/cli search skills
npx @conduit8/cli install skill pdf
```

## Commands

### Install a Skill

```bash
npx @conduit8/cli install skill pdf
npx @conduit8/cli install skill algorithmic-art
```

Options:

- `-f, --force` - Overwrite if skill already exists

### Remove a Skill

```bash
npx @conduit8/cli remove skill pdf
```

### List Installed Skills

```bash
npx @conduit8/cli list skills
```

### Search Registry

```bash
# Search all skills
npx @conduit8/cli search skills

# Search by keyword
npx @conduit8/cli search skills table
npx @conduit8/cli search skills pdf
```

## Available Skills

Currently includes official Anthropic skills:
- **pdf** - PDF manipulation toolkit
- **algorithmic-art** - Create algorithmic art with p5.js
- **webapp-testing** - Web testing with Playwright
- **xlsx** - Spreadsheet toolkit

More skills coming soon.

## How It Works

Skills are installed to `~/.claude/skills/` and work with Claude Code automatically. No restart needed.

## License

AGPL-3.0

## Links

- [conduit8.dev](https://conduit8.dev) - Web interface
- [GitHub](https://github.com/alexander-zuev/conduit8) - Source code
