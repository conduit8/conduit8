# User Research: Current Skills Experience

## Testing Method

Installed skills from Anthropic's official registry:
- PDF processing skill
- Web app testing skill

## Discovery Process

**How I found them:**
1. Went to GitHub (github.com/anthropics/skills)
2. Browsed README to see what's available
3. Cloned entire repo
4. Manually copied desired skills to `~/.claude/skills/`

**Pain points:**
- No searchable directory (just GitHub)
- Have to clone entire repo to get one skill
- No way to know what's good vs broken
- No usage stats or ratings
- Can't filter by category easily

## Installation Process

**Steps:**
1. Find skill on GitHub
2. Clone repo (or navigate in browser)
3. Copy skill folder to `~/.claude/skills/`
4. Restart Claude Code (maybe? unclear)

**Pain points:**
- Manual file copying
- No CLI command (`claude skill install pdf`)
- No version management
- No updates notification
- Don't know if it installed correctly until I try using it

## Quality Assessment

**PDF Skill:**
- Well-documented
- Clear examples
- Multiple use cases covered
- Proprietary license (not Apache 2.0)
- References external files (forms.md, reference.md)
- Requires Python libraries (pypdf, pdfplumber, reportlab)

**WebApp Testing Skill:**
- Clear decision tree
- Helper scripts included
- Best practices documented
- Requires Playwright
- Good examples

**Observations:**
- High quality (Anthropic official)
- BUT: No dependency checking
- Don't know if skills work without trying them
- No test suite to validate installation

## What's Missing (User Perspective)

### Discovery
- **No search** - Can't search "PDF" and find relevant skills
- **No categories** - Skills mixed together
- **No ratings** - Don't know what's good
- **No usage stats** - Can't see popularity
- **No recency** - Don't know if maintained

### Installation
- **Manual process** - Copy/paste files
- **No dependency check** - Don't know if Python libs installed
- **No validation** - Did it install correctly?
- **No versioning** - Which version do I have?

### Trust
- **No curation** - Anyone can publish to community repos
- **No security** - Could contain malicious code
- **No testing** - Don't know if it works
- **No author info** - Who made this?

### Maintenance
- **No updates** - How do I know there's a new version?
- **No changelogs** - What changed?
- **No deprecation** - Is this still supported?

## Value of a Registry

### What users actually want:

**1. Better Discovery**
- Search by keyword ("PDF", "testing", "images")
- Filter by category (documents, dev tools, creative)
- Sort by popularity, recency, rating
- See usage stats ("1,200 installs")

**2. Easier Installation**
- One command: `moonshot install pdf`
- Automatic dependency check
- Validation that it works
- Version management

**3. Quality Signals**
- Ratings/reviews
- Usage stats
- Author verification
- Last updated date
- Test results (does it work?)

**4. Better Metadata**
- Clear description
- Required dependencies
- Compatible Claude Code versions
- License info
- Examples/screenshots

**5. Maintenance**
- Update notifications
- Changelogs
- Deprecation warnings
- Security alerts

## Existing Directories: What They Provide

**ClaudeMarketplaces / ClaudeCodeMarketplace:**
- List of GitHub repos
- Basic categorization
- That's it

**What they DON'T provide:**
- No installation help
- No quality signals
- No search (beyond GitHub)
- No usage stats
- No curation

## Conclusion: Registry Value Proposition

**Core value:**
"Make it easy to find, install, and trust Claude Code skills"

**Day 1 features that matter:**
1. **Searchable directory** (better than GitHub)
2. **Quality signals** (ratings, usage, verification)
3. **Clear metadata** (dependencies, license, examples)
4. **Easy browsing** (categories, filters, sort)

**Nice to have (later):**
- CLI installation
- Dependency checking
- Update notifications
- Testing/validation

**Monetization (much later):**
- Paid skills
- Creator revenue
- x402 micropayments
