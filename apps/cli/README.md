# conduit8 CLI

Install and manage agent capabilities for Claude Code from the conduit8 registry. Discover, install, and manage in one command.

## 🚀 Quick Start

No installation needed - use `npx`:

```bash
npx conduit8 search skills      # Browse registry
npx conduit8 install skill pdf  # Install a skill
```

## Commands

### Install Skills

```bash
npx conduit8 install skill pdf                  # Personal install
npx conduit8 install skill pdf --project        # Project install
npx conduit8 install skill pdf --force          # Overwrite existing
```

**Options:**

- `-f, --force` - Overwrite existing skill
- `-p, --project` - Install to project `.claude/skills` (team-shared)

### Remove Skills

```bash
npx conduit8 remove skill pdf             # Remove from personal
npx conduit8 remove skill pdf --project   # Remove from project
```

### List Installed Skills

```bash
npx conduit8 list skills   # Show installed skills
```

### Search Registry

```bash
npx conduit8 search skills        # Browse all
npx conduit8 search skills pdf    # Search by keyword
```

## 📦 Available Skills

20+ agent capabilities across multiple categories:

- **Content** - Brand voice, email conversion, viral content
- **Data** - CSV/XLSX analysis, research synthesis
- **Development** - Zero-to-prod deployment, security audits
- **Creative** - Algorithmic art, canvas design, web testing
- **Marketing** - SEO optimization, landing pages
- **Business** - Pitch deck psychology

Browse all: `npx conduit8 search skills`

## Installation Directories

- **Personal**: `~/.claude/skills/` (default)
- **Project**: `./.claude/skills/` (use `--project` flag)

Skills work immediately, no restart needed.

## 🔗 Links

- [conduit8.dev](https://conduit8.dev) - Web registry
- [Issues](https://github.com/conduit8/conduit8/issues) - Bug reports & feature requests
- [npm](https://www.npmjs.com/package/conduit8) - Package page

## License

AGPL-3.0
