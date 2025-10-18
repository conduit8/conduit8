# Agent Moonshot: Claude Code Skills Marketplace

## Executive Summary

Build a platform where users can:
1. **Discover** Claude Code Skills and Plugins (better than GitHub)
2. **Install** them easily (MCP server + auto-installation)
3. **Share** them (curated registry)
4. **[Future] Monetize** with x402 micropayments
5. **[Future] Expose** as HTTP endpoints for broader access

## Phased Approach

### Phase 1: Better Discovery (MVP - Launch Today)
**Problem:** Finding skills on GitHub is painful, no search, no quality signals

**Solution:** MCP server that indexes curated skills directory
- MCP server indexes all skills (like Context7 for docs, but for skills)
- Claude can search/browse skills via MCP
- Auto-install skills via MCP commands
- Beat Anthropic to market (their turf, our speed)

**Value:** "Context7 for Claude Code skills"

**MCP Server Tools:**
1. `search_skills` - Search by keyword/category
2. `get_skill_details` - Full skill info + examples
3. `install_skill` - Auto-download to `~/.claude/skills/`
4. `list_installed_skills` - Show what's installed

**Registry Structure:**
```
registry/
├── skills/
│   ├── pdf/
│   │   ├── SKILL.md
│   │   ├── metadata.json (author, deps, stats)
│   │   └── [files]
│   └── ...
└── index.json (searchable)
```

**User Experience:**
```
User: Find me a PDF processing skill
Claude: [Uses MCP search_skills]
Found: pdf - Comprehensive PDF toolkit (4.8★, 1.2K installs)

User: Install it
Claude: [Uses MCP install_skill]
Installed to ~/.claude/skills/pdf
```

**Day 1 Launch Timeline:**
- Hour 1-2: MCP server skeleton + search
- Hour 3-4: Registry (GitHub) with 20 curated skills
- Hour 5-6: install_skill implementation
- Hour 7-8: Publish NPM + launch

### Phase 2: Payments (Later)
**Problem:** No creator monetization

**Solution:** x402 micropayment integration
- HTTP-native micropayments ($0.001+ per request)
- 80% creator revenue share
- Instant settlement (2 seconds via USDC)
- Requires time to implement properly

### Phase 3: HTTP Endpoints (Later)
**Problem:** Skills locked to Claude Code client

**Solution:** Expose skills as REST APIs
- Universal HTTP access (CI/CD, custom apps, any AI tool)
- Edge execution (Cloudflare Workers)
- Sandboxed environment
- Requires execution infrastructure

## What We're Building

### Core Concepts

**Skills:** Folders with `SKILL.md` + optional scripts/templates. Model-invoked (Claude decides when to use). Example: PDF processing, web testing, image generation.

**Plugins:** Bundles of skills + commands + hooks + MCP servers. Distributed via marketplaces.

**x402:** HTTP-native micropayment protocol. `402 Payment Required` status code → client pays → server delivers. $0.001 minimum, 2-second settlement.

### Technical Stack (Phase 2+)

**Backend:**
- Cloudflare Workers (edge execution)
- R2 (skill storage)
- D1 (metadata)
- x402 + Coinbase CDP (payments)

**Frontend:**
- React + Vite
- Tailwind CSS v4
- Radix UI

## Resources

**Documentation:**
- [Claude Code Skills](https://docs.claude.com/en/docs/claude-code/skills)
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
- [Anthropic Skills Registry](https://github.com/anthropics/skills)
- [x402 Protocol](https://github.com/coinbase/x402)
- [Coinbase CDP x402](https://docs.cdp.coinbase.com/x402/welcome)

**Competitors:**
- See `/docs/competitive-analysis.md`

**User Research:**
- See `/docs/user-research.md`

**Detailed Specs:**
- See `/docs/concepts-reference.md`
