# @conduit8/cli

Claude Code Skills Manager - Install and manage skills from the Conduit8 registry.

## Installation

```bash
npx @conduit8/cli [command]
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

## Development

This is currently a stub implementation for testing. It:

- Uses dummy skill data instead of real API calls
- Creates minimal SKILL.md files in `~/.claude/skills/`
- Simulates download progress
- Tests all CLI flows end-to-end

### Build

```bash
pnpm build
```

### Test Locally

```bash
pnpm build
node dist/index.js search skills
node dist/index.js install skill pdf
node dist/index.js list skills
node dist/index.js remove skill pdf
```

## Future

When the backend is ready:

- Replace stubbed API in `src/utils/api.ts`
- Implement real ZIP download and extraction in `src/utils/fs.ts`
- Add real download tracking

The CLI interface is complete and will not change.
