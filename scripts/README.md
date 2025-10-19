# Conduit8 Scripts

## Import Local Skills

Import skills from `/skills` directory to R2 + D1.

### Setup (First time only)

Scripts are NOT part of the workspace. Install dependencies manually:

```bash
cd scripts
pnpm install --ignore-workspace
```

### Usage

```bash
# From project root
pnpm import:skills
```

### What it does

1. Scans `/skills/` for folders with `SKILL.md`
2. Parses YAML frontmatter for metadata
3. Creates ZIP of each skill folder
4. Uploads to R2: `skills/{id}.zip`
5. Creates placeholder image: `images/{id}.png`
6. Inserts metadata to local D1 database

### For other sources

1. Clone repo: `git clone <repo> skills-notion`
2. Update `SKILLS_DIR` in script
3. Run script

### Notes

- Uses local Wrangler bindings (R2 + D1)
- ZIPs stored in `.temp-zips/` (gitignored)
- Assumes Anthropic skills (set `author='anthropic'`)
- For Notion skills, change author field
