# Conduit8: Claude Code Skills Registry

## Executive Summary

Platform where users can:
1. **Discover** Claude Code skills (better than GitHub)
2. **Install** them easily (MCP server + auto-installation)
3. **Share** them (curated registry)
4. **[Future] Monetize** with x402 micropayments
5. **[Future] Expose** as HTTP endpoints

## Phase 1: Visual Skills Directory (MVP)

**Problem:** Finding working skills on GitHub is painful - no search, no quality signals, no idea what they do

**Solution:** Beautiful landing page with 20 hand-tested skills
- AI-generated Anthropic-style picture per skill (show what it does)
- Clear description + 2-3 real examples
- Download button → ZIP with install instructions
- Only you curate (quality by default)

**Why this works:**
- Visual differentiation (no competitor has pictures)
- Curation is the feature (not a limitation)
- Fast to ship
- Validates demand before building MCP server

### MVP Scope
- ✅ 20 tested, working skills
- ✅ Beautiful picture per skill (Anthropic aesthetic)
- ✅ Description (2 sentences: what it does, when to use)
- ✅ Real examples (2-3 use cases)
- ✅ **npm CLI package**: `npx @conduit8/cli install <skill-name>`
- ✅ Download button + manual install instructions (fallback)
- ❌ No user submissions (you curate)
- ❌ No MCP server yet (build after validation)
- ❌ No ratings/search (20 skills = browse is fine)

### Launch Strategy
- Twitter: Visual thread showing skill cards + examples
- Tag @AnthropicAI
- Hook: "20 hand-tested Claude Code skills that actually work"
- Screenshots designed to be shared

## Technical Implementation

### Skills vs Plugins

**Skill** = Individual folder with SKILL.md
- Example: `pdf/`, `algorithmic-art/`
- Self-contained capability
- **Conduit8 hosts individual skills**

**Plugin** = Bundle of multiple skills
- Example: `document-skills` contains pdf, xlsx, docx, pptx
- Distribution mechanism via `/plugin` marketplace
- Optional grouping layer (not MVP)

### Skill Structure

**Required:**
```
skill-name/
└── SKILL.md              # YAML frontmatter + markdown instructions
```

**Optional (common):**
```
skill-name/
├── SKILL.md
├── scripts/              # Python, JS helper code
├── templates/            # File templates
├── reference.md          # Additional docs
└── LICENSE.txt
```

**SKILL.md Format:**
```yaml
---
name: skill-name              # lowercase-hyphen-case
description: What it does...  # Used for Claude discovery
license: Apache 2.0           # Optional
allowed-tools: Read, Bash     # Optional
---

# Markdown instructions for Claude
...
```

### Storage Architecture

**R2 Object Storage:**
```
conduit8-skills/
├── skills/              # Skill ZIPs (1-50MB, downloaded once)
│   ├── pdf.zip
│   └── algorithmic-art.zip
└── images/              # Skill preview images (~100KB, frequently cached)
    ├── pdf.png
    └── algorithmic-art.png
```

**Why separate folders:**
- Different access patterns (images loaded constantly, ZIPs on download only)
- Different caching strategies (aggressive CDN for images)
- Size difference (images ~100KB vs ZIPs 1-50MB)
- Clear organization and future flexibility

**D1 Database Schema:**
```sql
-- Core skill metadata (static, rarely changes)
CREATE TABLE skills (
  id TEXT PRIMARY KEY,           -- From YAML name (e.g., 'pdf')
  name TEXT NOT NULL,            -- Display name
  description TEXT NOT NULL,     -- From YAML
  category TEXT,                 -- Curator-assigned

  -- Storage pointers
  zip_key TEXT NOT NULL,         -- R2: skills/{id}.zip
  image_key TEXT NOT NULL,       -- R2: images/{id}.png

  -- Content (MVP: stored as JSON/text)
  examples TEXT NOT NULL,        -- JSON array: ["Extract tables: \"...\"]
  curator_note TEXT,             -- Personal curation note

  -- Attribution (WHO made it)
  author TEXT NOT NULL,          -- 'anthropic', 'notion', 'user@email.com'
  author_kind TEXT NOT NULL,     -- 'official', 'community'

  -- Source (HOW we got it)
  source_type TEXT NOT NULL,     -- 'import', 'pr', 'submission'
  source_url TEXT,               -- Original URL or NULL

  -- Timestamps
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,

  CHECK (author_kind IN ('official', 'community')),
  CHECK (source_type IN ('import', 'pr', 'submission'))
);

CREATE INDEX idx_category ON skills(category);

-- Download tracking (hot writes, separate to avoid contention)
CREATE TABLE skill_stats (
  skill_id TEXT PRIMARY KEY,
  download_count INTEGER DEFAULT 0,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE INDEX idx_downloads ON skill_stats(download_count DESC);
```

**Attribution & Source Examples:**

Anthropic skill (imported from GitHub):
- `author='anthropic'`, `author_kind='official'`
- `source_type='import'`, `source_url='https://github.com/anthropics/skills/tree/main/pdf'`

Notion skill (imported from Notion page):
- `author='notion'`, `author_kind='official'`
- `source_type='import'`, `source_url='https://www.notion.so/...'`

User PR contribution:
- `author='user@email.com'`, `author_kind='community'`
- `source_type='pr'`, `source_url='https://github.com/conduit8/conduit8/pull/123'`

User web submission (future):
- `author='user@email.com'`, `author_kind='community'`
- `source_type='submission'`, `source_url=NULL`

**Examples JSON structure:**
```json
{
  "examples": [
    "Extract tables: \"Get revenue table from Q4-report.pdf\"",
    "Merge PDFs: \"Combine all PDFs in contracts/ folder\"",
    "Fill forms: \"Fill W-9 with company details\""
  ]
}
```

### Installation Flow

```
User: npx @conduit8/cli install pdf

CLI Process:
1. GET /api/skills/pdf
   → Returns: { id, name, description, zipKey, downloadUrl }

2. Download from R2: skills/pdf.zip

3. Extract to: ~/.claude/skills/pdf/

4. POST /api/skills/pdf/downloaded
   → Increment download_count

5. Success message + usage instructions
```

### Repository Structure

**Skills are user content, not app code. Separation of concerns:**

```
conduit8/
├── apps/            # Applications (web, worker)
├── packages/        # Packages (core, cli)
├── registry/        # Content registry (version controlled)
│   ├── skills/      # Individual skill metadata files
│   │   ├── pdf.json
│   │   ├── algorithmic-art.json
│   │   └── my-skill.json
│   ├── skills.json  # Combined file (CI-generated)
│   └── agents/      # Future: other agent types
└── .github/
    └── workflows/
        └── sync-registry.yml
```

**Skills stored in R2. Repo tracks metadata only.**

**Individual skill file (registry/skills/pdf.json):**
```json
{
  "id": "pdf",
  "name": "PDF Toolkit",
  "description": "Comprehensive PDF manipulation...",
  "category": "documents",
  "source": "https://github.com/anthropics/skills/tree/main/document-skills/pdf",
  "author": "anthropic",
  "author_kind": "official"
}
```

**Combined file (registry/skills.json - CI generated):**
```json
{
  "skills": [
    { "id": "pdf", "name": "PDF Toolkit", ... },
    { "id": "algorithmic-art", ... }
  ],
  "generated_at": "2025-01-19T...",
  "count": 20
}
```

### Data Flow Architecture

**Sources of Truth:**
- **D1 Database**: Production source for UI/API (fast reads)
- **R2 Storage**: Skill ZIPs and images (CDN-cached)
- **Git Repository**: Version-controlled metadata (individual JSON files)

**Workflow:**
```
Individual JSON files (registry/skills/*.json)
    ↓
CI combines → registry/skills.json
    ↓
CI syncs → R2 (skills/*.zip) + D1 (metadata)
    ↓
UI/API reads from D1
CLI downloads from R2
```

**Why individual files + combined file:**
- **Individual**: Clean PRs, no merge conflicts, scalable
- **Combined**: Convenience for bulk operations, backwards compatibility
- **D1**: Fast production queries
- **Git**: Version control, audit trail

### Submission Pathways (Both in MVP)

**Priority: Web UI first, then GitHub PR**

#### Pathway 1: Web UI (Implement First)

**User Flow:**
1. Click "Submit Skill" button (action bar on homepage)
2. Dialog opens with form:
   - Email (for updates)
   - Skill name, description, category
   - Upload ZIP (max 10MB, drag/drop support)
3. Submit → "Under review" confirmation
4. Email notification sent to curator

**Review Flow:**
1. Admin panel: `/admin/pending`
2. View submission details
3. Download ZIP, test locally
4. Approve → adds to `data/skills.json` + syncs to R2/D1
   OR
   Reject → email reason to user

**API:**
```typescript
POST /api/skills/submit
{
  email: string,
  skillName: string,
  description: string,
  category: string,
  zipFile: Blob  // Max 10MB
}

1. Validate ZIP contains SKILL.md
2. Parse SKILL.md frontmatter
3. Store in pending_submissions (D1)
4. Upload ZIP to R2: pending/{uuid}.zip
5. Send admin email notification
6. Return: "Submission received"

POST /admin/approve/{id}
1. Move ZIP: pending/{uuid}.zip → skills/{id}.zip
2. Create registry/skills/{id}.json (via GitHub API)
3. Commit to GitHub (triggers CI to regenerate registry/skills.json)
4. Insert D1 skills table
5. Email submitter: approved

POST /admin/reject/{id}
1. Delete pending ZIP
2. Update status in pending_submissions
3. Email submitter with reason
```

**D1 Schema:**
```sql
CREATE TABLE pending_submissions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  zip_key TEXT NOT NULL,        -- R2: pending/{uuid}.zip
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  submitted_at INTEGER NOT NULL,
  reviewed_at INTEGER,
  rejection_reason TEXT
);
```

#### Pathway 2: GitHub PR (Implement Second)

**User Flow:**
1. Fork conduit8 repo
2. Add file `registry/skills/my-skill.json`:
   ```json
   {
     "id": "my-skill",
     "name": "My Skill",
     "description": "What it does",
     "category": "productivity",
     "source": "https://github.com/user/my-skill",
     "author": "user@email.com",
     "author_kind": "community"
   }
   ```
3. Open PR
4. GitHub Action validates (comments on PR)
5. You review + merge
6. Action auto-syncs to R2/D1

**GitHub Action** (on PR):
```yaml
- Detect new/changed files in registry/skills/
- For each file:
  - Validate JSON schema
  - Fetch skill from source URL
  - Validate SKILL.md exists
  - Security scan
- Comment: "✅ Validated" or "❌ Issues"
```

**GitHub Action** (on merge to main):
```yaml
- Detect changes in registry/skills/*.json
- Regenerate registry/skills.json (combine all individual files)
- For each new/updated skill:
  - Clone from source URL
  - ZIP folder
  - Upload to R2: skills/{id}.zip
  - Upsert D1 skills table
```

### Security Validation (Both Pathways)

**Automated checks:**
```typescript
// Structure
- SKILL.md must exist
- Valid YAML frontmatter
- name matches id

// Security
- No binaries (.exe, .so, .dylib)
- No secrets/tokens (regex)
- Size limits: 10MB per file, 50MB total
- Allowed scripts: .py, .js, .sh only

// Content
- Description < 500 chars
- Valid category
```

**Manual review (you):**
- Review skill code
- Test locally
- Approve/reject

### MVP Implementation Tasks

**Seed Skills:**
1. Clone anthropics/skills
2. Select 20 skills
3. Script to:
   - Parse SKILL.md → create registry/skills/{id}.json
   - ZIP each skill → upload R2
   - Insert D1
   - Generate registry/skills.json (combined)

**Website + CLI:**
1. Website lists skills from D1
2. Skill detail pages
3. npm CLI package
4. Download from R2 → extract to ~/.claude/skills/

**Launch:**
1. AI-generated images per skill
2. Download counters
3. Launch tweet

**Post-MVP: User Submissions**
1. Web submission form
2. Pending queue UI
3. Admin approval panel
4. Email notifications

## Feature Backlog

### Installation Options (Both Viable)

**Option A: npm CLI Package** ✅ *Included in MVP*
```bash
npx @conduit8/cli install <skill-name>
```
- **Pros**: Standalone, works immediately, full UX control
- **Cons**: Not native to Claude Code
- **Status**: MVP

**Option B: Plugin Marketplace Discovery**
```bash
/plugin marketplace add conduit8/marketplace
/plugin install <skill-name>
```
- **Pros**: Native Claude integration, discoverable in `/plugin` menu
- **Cons**: Requires plugin.json per skill, heavier maintenance
- **Status**: Post-MVP (if traction good)

### Post-MVP Features

**Phase 1.5 (After validation):**
- Download counters (social proof)
- "Last updated" timestamps
- Personal curator notes ("Why I picked this")
- Email collection for updates
- CLI commands: `list`, `search`, `update`

**Phase 1.75 (Growth):**
- User submissions (with approval queue)
- Ratings/reviews
- Usage statistics
- **Sorting & Filtering:**
  - Sort: Most Downloaded (default), Recently Added, A-Z, Z-A
  - Filter by Category: Documents, Creative, Development, Testing, Data, Media, DevOps
  - Filter by Source: All, Verified, Community
  - Badge-style category chips + dropdown controls
- Search functionality (already implemented)

## Phase 2: Payments (Later)

**Problem:** No creator monetization

**Solution:** x402 micropayment integration
- HTTP-native micropayments ($0.001+ per request)
- 80% creator revenue share
- Instant settlement (2 seconds via USDC)
- Requires time to implement properly

## Phase 3: HTTP Endpoints (Later)

**Problem:** Skills locked to Claude Code client

**Solution:** Expose skills as REST APIs
- Universal HTTP access (CI/CD, custom apps, any AI tool)
- Edge execution (Cloudflare Workers)
- Sandboxed environment
- Requires execution infrastructure

## Core Concepts

**Skills:** Folders with `SKILL.md` + optional scripts/templates. Model-invoked (Claude decides when to use). Example: PDF processing, web testing, image generation.

**Plugins:** Bundles of skills + commands + hooks + MCP servers. Distributed via marketplaces.

**x402:** HTTP-native micropayment protocol. `402 Payment Required` status code → client pays → server delivers. $0.001 minimum, 2-second settlement.

## Tech Stack

**Phase 1 (Current):**
- React + Vite
- Tailwind CSS v4 + Radix UI
- Cloudflare Workers (Hono)
- D1 (metadata), R2 (storage)

**Phase 2+ (Future):**
- x402 + Coinbase CDP (payments)
- Sandboxed execution environment

## Frontend Scope (MVP)

### Pages (3 Total)

1. **Homepage** (`/`) - Skill discovery
2. **Skill Detail** (`/skills/:id`) - Installation + examples
3. **Admin Queue** (`/admin/pending`) - Review submissions (Better Auth protected)

### Components

**Public:**
- `SkillCard` - Grid item with image, name, description, downloads
- `SkillDetail` - Full page with install command, examples, curator note
- `InstallCommand` - Copy-paste UI with download fallback
- `SubmitDialog` - Upload form (triggered from homepage button)
- `SearchBar` - Client-side filter

**Admin:**
- `PendingTable` - Submission queue
- `SubmissionRow` - Approve/reject actions

## UI Design / Wireframes

### Page 1: Homepage / Skill Grid

```
┌─────────────────────────────────────────────────────────────────┐
│  [C8 Logo]  Conduit8                              [GitHub]     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│         Hand-tested Claude Code Skills                          │
│         20 curated, working skills. Install in seconds.         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [+ Submit]  ┌─────────────────────┐  [Sort ▼]  [Source ▼]    │
│              │  🔍  Search...      │                           │
│              └─────────────────────┘                           │
│                                                                 │
│  [All] [Documents] [Creative] [Development] [Testing] [Data]   │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ [AI Image]     │  │ [AI Image]     │  │ [AI Image]     │
│                │  │                │  │                │
│ PDF Toolkit    │  │ Algorithmic    │  │ Web Testing    │
│ Process PDFs,  │  │ Art            │  │ Test web apps  │
│ extract text   │  │ Generate art   │  │ with Playwright│
│                │  │                │  │                │
│ 234 downloads  │  │ 189 downloads  │  │ 156 downloads  │
└────────────────┘  └────────────────┘  └────────────────┘

... (3 columns, 20 total skills)
```

**Key Elements:**
- Header: Logo + GitHub link
- Hero: Headline + subhead
- Action Bar: Submit button (left) + Search bar (middle) + Sort dropdown + Source dropdown (right)
- Category Filters: Badge-style chips (All, Documents, Creative, Development, Testing, Data, Media, DevOps)
- Grid: 3 cols desktop, 1 col mobile
- Cards: AI image, name, description, download count
- Search: Live client-side filter (instant with 20 items)
- Submit Dialog: Email, name, description, category, ZIP upload (drag/drop)

### Page 2: Skill Detail Page

```
┌─────────────────────────────────────────────────────────────────┐
│  [C8 Logo]  Conduit8              ← Back to all skills          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────┐                                 │
│  │   [Large AI Image]        │   PDF Toolkit                    │
│  │                           │   Comprehensive PDF manipulation │
│  └───────────────────────────┘   234 downloads                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Installation                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  npx @conduit8/cli install pdf                    [Copy] │ │
│  └───────────────────────────────────────────────────────────┘ │
│  Or: [Download ZIP]                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  What It Does                                                   │
│  This skill enables Claude to work with PDF files directly.    │
│  Extract text/tables, create PDFs, merge/split, handle forms.  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Example Use Cases                                              │
│  1. Extract tables: "Get revenue table from Q4-report.pdf"     │
│  2. Merge PDFs: "Combine all PDFs in contracts/ folder"        │
│  3. Fill forms: "Fill W-9 with company details"                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Curator's Note                                                 │
│  "Most reliable skill in the registry. Handles complex PDFs    │
│  without issues. Great for document workflows." — Alexander    │
└─────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- Hero: Large image + title + download count
- Install: Command (with copy) + manual download fallback
- What It Does: 2-3 sentence explanation
- Examples: 3 concrete use cases with quotes
- Curator Note: Personal take (trust + personality)

**Mobile:**
- Stack image above text
- 1 column layout
- Horizontal scroll for install command

### Content Requirements Per Skill

- AI-generated image (Anthropic style: abstract, artistic)
- Name (title case)
- 1-2 sentence description
- 3 example use cases with user quotes
- Curator note (2-3 sentences, personal voice)
- Category (for future)

### Design Principles

1. **Visual-first** - Images differentiate from GitHub
2. **Trust signals** - Download counts, curator notes
3. **Frictionless** - Install command front and center
4. **Personality** - Human curation, not algorithm
5. **Fast** - No loading, instant search

## Resources

**Documentation:**
- [Claude Code Skills](https://docs.claude.com/en/docs/claude-code/skills)
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
- [Anthropic Skills Registry](https://github.com/anthropics/skills)
- [x402 Protocol](https://github.com/coinbase/x402)
- [Coinbase CDP x402](https://docs.cdp.coinbase.com/x402/welcome)

**Internal:**
- `/docs/internal/competitive-analysis.md`
- `/docs/internal/user-research.md`
- `/docs/internal/concepts-reference.md`
