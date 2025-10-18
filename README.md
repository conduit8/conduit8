# Conduit8

**Curated repository of Claude Code skills, plugins, and tools**

An open-source registry that makes it easy to discover, install, and share Claude Code skills. Better discovery than GitHub chaos.

## What is Conduit8?

Conduit8 solves the pain of finding quality Claude Code skills:

- **Better Discovery**: Search by keyword, category, usage stats instead of browsing GitHub repos
- **Easy Installation**: One-command install via MCP server instead of manual file copying
- **Quality Signals**: Ratings, verification, and usage metrics instead of guessing what works
- **Curated Registry**: Hand-picked, tested skills instead of 10,000+ untested repos

## Features

- **Search & Browse**: Find skills by keyword, category, or popularity
- **Quality Metadata**: Clear descriptions, dependencies, examples
- **Direct Download**: Get skill files for installation
- **Usage Stats**: See what's popular and actively maintained

## Contributing

Want to add a skill to the registry?

1. Fork this repo
2. Add your skill to the registry (follow existing structure)
3. Submit a pull request with:
   - Skill name and description
   - Required dependencies
   - Example usage
   - Your GitHub profile

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Run tests
pnpm test
```

**Tech Stack**: React, TypeScript, Cloudflare Workers (Hono), D1, R2

## License

MIT
