# Skill Submission Flow

## Overview

User-friendly skill submission flow matching Claude Skills structure. Users write/upload SKILL.md content, add optional supporting files, provide metadata, and the frontend creates the ZIP package automatically.

## How It Works

**User Experience:**
- Write/paste SKILL.md content OR upload SKILL.md file
- Add optional supporting files (scripts, resources, templates)
- Provide metadata via form fields
- **Frontend creates ZIP package automatically**
- One-click submission

## Real Claude Skills Structure

Based on research from official Anthropic documentation and repositories:

```
my-skill/
├── SKILL.md              # Required: Core skill with frontmatter
├── resources/            # Optional: Supporting files
│   ├── reference.md
│   └── examples.md
└── scripts/              # Optional: Helper scripts
    └── setup.sh
```

**SKILL.md Frontmatter (YAML):**
```yaml
---
name: my-awesome-skill
description: A helpful skill that does amazing things
license: MIT
allowed-tools: Bash Read Write Grep
---

# My Awesome Skill

## Instructions
Provide clear, step-by-step guidance for Claude...

## Examples
- Example use case 1
- Example use case 2
```

## Improved Form Structure (Reduced Error Rate)

### Step 1: Name & Description
**Display Name Input:**
- User-friendly name (e.g., "MCP Builder", "My Awesome Skill")
- Auto-generates valid skill name: `mcp-builder`, `my-awesome-skill`
- Shows both: "Display Name" and "Skill name (slug)" side-by-side
- Real-time name availability check
- Format: lowercase alphanumeric + hyphen only (per official spec)

**Description Field:**
- Guidance: "Describe **when Claude should use** this skill, not just what it does"
- Example placeholder: "Use when building MCP servers that integrate external APIs with LLMs"
- Third-person format: "Use when..." not "This skill..."
- Min 50 characters, max 500 characters

### Step 2: SKILL.md Content
- **Textarea** for writing/pasting content OR **Upload button**
- **Live frontmatter validation** with clear error messages
- **Markdown body validation** (minimum 50 characters required)
- Preview of parsed frontmatter (name, description, license, allowed-tools)
- Visual feedback: green checkmark / red error icon

**Required frontmatter (per official spec):**
- `name` - Auto-populated from Step 1
- `description` - Auto-populated from Step 1

**Optional frontmatter:**
- `license` - Defaults to "MIT" if omitted
- `allowed-tools` - Only needed if skill uses Bash, Read, Write, etc.

### Step 3: Organize Files (NEW - Critical for Validation)
**File Categorization UI:**
- Upload files and assign each to a category
- Categories match official Anthropic structure:
  - **Scripts** (`scripts/`) - Executable code (Python, Bash, etc.)
  - **References** (`references/`) - Documentation, API specs
  - **Assets** (`assets/`) - Templates, images, fonts
  - **Root** - Files that go in ZIP root

**Visual file organizer:**
```
[Upload Files]

Scripts (executable):
  ✓ rotate_pdf.py [x remove]
  ✓ setup.sh [x remove]

References (docs):
  ✓ api_docs.md [x remove]

Assets (templates, images):
  ✓ logo.png [x remove]

[+] Add more files
```

**Validation:**
- Max 20 files total
- Each file max 5MB
- File names sanitized (no path traversal)
- Organized into proper directories automatically

### Step 4: Optional Metadata
- **License** (dropdown with common licenses, defaults to MIT)
- **Allowed Tools** (text input with helper text: "Only needed if skill uses Bash, Read, Write, etc.")
- **Source URL** (optional, link to GitHub/docs)
- **Examples** (tags input, 1-10 example use cases)

### Step 5: Preview & Submit (NEW - Prevent Errors)
**Preview Tab:**
- Shows complete SKILL.md with frontmatter
- Live markdown rendering
- Highlights any warnings

**Structure Tab:**
- Visual ZIP file tree:
```
my-skill-name.zip
├── SKILL.md
├── metadata.json
├── scripts/
│   ├── rotate_pdf.py
│   └── setup.sh
├── references/
│   └── api_docs.md
└── assets/
    └── logo.png
```
- Total ZIP size display
- File count summary

**Final Validation:**
- ✓ Valid skill name format
- ✓ Description follows "Use when..." pattern
- ✓ SKILL.md has markdown body (50+ chars)
- ✓ All files properly categorized
- ✓ No name conflicts
- ⚠️ Warnings for missing optional fields

## Client-Side ZIP Creation

The frontend creates the ZIP package using `JSZip` with proper directory structure:

```typescript
skill-name.zip
├── SKILL.md                    # User-provided content with frontmatter
├── metadata.json               # Generated from form fields
├── scripts/                    # Executable code (categorized by user)
│   ├── rotate_pdf.py
│   └── setup.sh
├── references/                 # Documentation (categorized by user)
│   └── api_docs.md
└── assets/                     # Templates, images (categorized by user)
    └── logo.png
```

**File Organization:**
- User uploads files and selects category (scripts/references/assets/root)
- Frontend automatically creates directory structure
- Files sanitized to prevent path traversal
- Empty directories omitted from ZIP

**metadata.json structure:**
```json
{
  "author": "John Doe",
  "authorKind": "community",
  "sourceType": "submission",
  "sourceUrl": "https://github.com/user/repo",
  "examples": ["Example 1", "Example 2"],
  "curatorNote": null
}
```

## User Flow

1. User clicks "Submit" button
2. If not authenticated → Login
3. If authenticated → Submit Skill dialog opens
4. User writes or uploads SKILL.md
   - Frontmatter is validated in real-time
   - Preview shows parsed fields
5. User optionally uploads additional files
6. User fills in metadata (author, source URL, examples)
7. User clicks "Submit Skill"
8. **Frontend creates ZIP package** from:
   - SKILL.md content
   - metadata.json (generated)
   - Additional files
9. ZIP uploaded to backend
10. Backend processes and stores skill
11. Success notification + dialog closes

## API Contract

**Endpoint:** `POST /api/v1/skills`

**Request Format:** `multipart/form-data`

**Field:** `skill` (File) - Complete ZIP package

**ZIP Contents:**
- `SKILL.md` (required)
- `metadata.json` (required)
- Additional files (optional)

**Response:**
```typescript
{
  success: boolean
  message: string
  skillSlug?: string
}
```

## Backend Processing

The backend handler (`ingest-skill.handler.ts`) remains unchanged:

1. Download ZIP from request
2. Extract SKILL.md and parse frontmatter
3. Extract metadata.json
4. AI categorization (from description)
5. Validate with SkillSchema
6. Upload ZIP to R2 storage
7. Generate thumbnail image
8. Insert to D1 database
9. Return success response

## Technical Implementation

### New Files

**Components:**
- `submit-skill-form.v2.tsx` - New form with SKILL.md editor and file uploads
- `submit-skill-dialog.v2.tsx` - New dialog using new form

**Utilities:**
- `create-skill-zip.ts` - Client-side ZIP creation
  - `createSkillZip()` - Create ZIP from inputs
  - `parseSkillFrontmatter()` - Parse YAML frontmatter
  - `validateSkillMd()` - Validate frontmatter

**Schemas:**
- `submit-skill-form.schema.v2.ts` - New validation schema

**Services:**
- `skills-api.v2.ts` - Simplified API (just upload ZIP)

### Dependencies

**Required:**
- `jszip` - Client-side ZIP creation
- `gray-matter` - YAML frontmatter parsing (already installed)

**Install:**
```bash
pnpm add jszip --filter @conduit8/web
pnpm add -D @types/jszip --filter @conduit8/web
```

## Current Implementation Status

### ✅ Frontend (Built - Needs Improvements)
Current features:
- Submit skill dialog UI
- SKILL.md editor with live validation
- Multi-file uploader
- Metadata form fields
- Client-side ZIP creation
- Form validation with Zod
- React Query mutation hook
- **Stubbed API call** for testing UI flow

**Critical Issues to Fix (Based on Official Spec Review):**
1. ❌ Not enforcing hyphen-case name format (must be lowercase + hyphen only)
2. ❌ Requiring `license` and `allowed-tools` (they're optional per spec)
3. ❌ Files dumped at ZIP root (need scripts/references/assets organization)
4. ❌ Poor description guidance (users don't know to write "Use when...")
5. ❌ No markdown body validation (only validates frontmatter)
6. ❌ No preview step (users can't see final ZIP structure)
7. ❌ No name conflict checking

### ❌ Backend (TODO)
- API endpoint: `POST /api/v1/skills`
- ZIP extraction and validation
- Database schema updates
- File storage (R2)
- Status workflow (pending → approved)

## Critical Improvements Needed

### Priority 1: Match Official Spec (Breaking Changes)
1. **Auto-generate valid skill name** from display name (lowercase + hyphen only)
2. **Make license & allowed-tools optional** in validation
3. **Add file categorization** (scripts/references/assets dropdown per file)
4. **Update description guidance** ("Use when..." placeholder/help text)
5. **Validate markdown body** (min 50 characters beyond frontmatter)

### Priority 2: Reduce User Errors
6. **Add ZIP structure preview** before submission
7. **Check name availability** in real-time
8. **Show complete SKILL.md preview** with frontmatter merged
9. **Display file tree** of final ZIP package
10. **Add inline examples** for each field

## Validation

### Frontend Validation

**Skill Name (Auto-generated):**
- Display name: 3-100 characters
- Skill name (slug): lowercase alphanumeric + hyphen only
- Format validation: `^[a-z0-9]+(-[a-z0-9]+)*$`
- Real-time availability check against existing skills

**SKILL.md Content:**
- Must contain YAML frontmatter (enclosed in `---`)
- **Required fields:**
  - `name` (auto-populated from skill name)
  - `description` (50-500 chars, "Use when..." format)
- **Optional fields:**
  - `license` (defaults to "MIT" if omitted)
  - `allowed-tools` (only if skill uses Bash, Read, Write, etc.)
- **Markdown body:** Minimum 50 characters of instructions

**Additional Files:**
- Max 20 files total
- Each file max 5MB
- Must be categorized (scripts/references/assets/root)
- File names sanitized to prevent path traversal

**Metadata:**
- Author: 1-100 chars (alphanumeric + common chars)
- Source URL: Optional, any valid URL (no domain restrictions)
- Examples: 0-10 items (max 200 chars each)

### Backend Validation

- ZIP structure validation
- Frontmatter schema validation
- Metadata schema validation
- File size limits
- Malware scanning (recommended)

## Security

✅ **Authentication required** - Only logged-in users can submit

✅ **Frontend validation** - Prevent invalid submissions

✅ **Client-side ZIP creation** - User can't inject malicious ZIP structure

✅ **Backend re-validation** - Defense in depth

✅ **File size limits** - Prevent abuse

✅ **Content sanitization** - Markdown is sanitized before display

## UX Improvements

### Real-Time Feedback
- ✅ Live SKILL.md frontmatter validation
- ✅ Visual indicators (green checkmark / red error)
- ✅ Preview of parsed frontmatter fields
- ✅ File list with sizes
- ✅ Tag count indicators

### User Guidance
- ✅ Placeholder with example SKILL.md
- ✅ Helpful descriptions for each field
- ✅ Clear error messages
- ✅ Upload buttons with icons

### Progressive Disclosure
- ✅ Optional sections clearly marked
- ✅ Collapsible file lists
- ✅ Step-by-step flow

## Example Submission (New Flow)

### Step 1: Name & Description
**User inputs:**
- Display Name: "Code Reviewer"
- Auto-generated: `code-reviewer` ✓ Available
- Description: "Use when reviewing code for security vulnerabilities, performance issues, and best practices. Analyzes code files and provides actionable improvement suggestions."

### Step 2: SKILL.md Content
**User writes:**
```yaml
---
name: code-reviewer
description: Use when reviewing code for security vulnerabilities, performance issues, and best practices. Analyzes code files and provides actionable improvement suggestions.
license: MIT
allowed-tools: Bash Read Grep Edit Write
---

# Code Reviewer

## Instructions
1. Read the code files in the project using the Read tool
2. Analyze for security vulnerabilities (SQL injection, XSS, etc.)
3. Check for performance issues (N+1 queries, inefficient algorithms)
4. Suggest improvements with specific code examples
5. Use the reference checklist for comprehensive coverage

## When to Use
- Before code review sessions
- After major feature implementations
- When refactoring legacy code
- For security audit preparation
```

### Step 3: Organize Files
**User uploads and categorizes:**
- **References:** `security-checklist.md` (review checklist)
- **References:** `common-vulnerabilities.md` (CVE patterns)
- **Assets:** `review-template.md` (report template)

### Step 4: Metadata
- License: MIT (selected from dropdown)
- Allowed Tools: "Bash Read Grep Edit Write"
- Source URL: "https://github.com/johndoe/code-reviewer-skill"
- Examples: ["Review React components", "Check API security", "Optimize database queries"]

### Step 5: Preview & Submit
**Structure Preview:**
```
code-reviewer.zip (127 KB)
├── SKILL.md
├── metadata.json
├── references/
│   ├── security-checklist.md
│   └── common-vulnerabilities.md
└── assets/
    └── review-template.md
```

**Validation:**
- ✓ Valid skill name: `code-reviewer`
- ✓ Description follows "Use when..." pattern
- ✓ SKILL.md has 320 characters of instructions
- ✓ All files properly categorized (3 files)
- ✓ No name conflicts
- ✓ Total size: 127 KB (within limits)

**Result:**
✅ ZIP uploaded to backend
✅ Skill queued for review
✅ User notified: "Your skill will be reviewed within 48 hours"

## Testing Checklist

### Step 1: Name & Description
- [ ] Display name auto-generates valid skill name
- [ ] Skill name format validated (lowercase + hyphen only)
- [ ] Real-time name availability check works
- [ ] Description validates "Use when..." pattern
- [ ] Min/max character limits enforced

### Step 2: SKILL.md Content
- [ ] Can write SKILL.md in textarea
- [ ] Can upload SKILL.md file
- [ ] Frontmatter validation works (required: name, description)
- [ ] Optional fields don't cause validation errors (license, allowed-tools)
- [ ] Markdown body validated (min 50 chars)
- [ ] Frontmatter preview shows correct data
- [ ] Validation errors display clearly

### Step 3: File Organization
- [ ] Can upload files and assign categories
- [ ] Categories: scripts, references, assets, root
- [ ] Can remove files
- [ ] File size limits enforced (max 5MB each)
- [ ] Max file count enforced (20 files)
- [ ] File names sanitized correctly

### Step 4: Metadata
- [ ] License dropdown works (defaults to MIT)
- [ ] Allowed tools field optional
- [ ] Source URL optional (no domain restrictions)
- [ ] Examples tags input works (0-10 tags)

### Step 5: Preview & Submit
- [ ] Preview tab shows complete SKILL.md
- [ ] Structure tab shows file tree
- [ ] ZIP size calculated correctly
- [ ] All validation checks pass before submit enabled
- [ ] ZIP creation organizes files into directories
- [ ] ZIP contains: SKILL.md, metadata.json, organized files

### Integration
- [ ] API upload succeeds (when backend ready)
- [ ] Success toast appears
- [ ] Dialog closes on success
- [ ] Error handling works
- [ ] Mobile responsive design

## Backend Implementation Proposal

### Database Schema Changes

#### 1. Add `status` Column to `skills` Table

```sql
-- Migration: Add submission status tracking
ALTER TABLE skills ADD COLUMN status TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE skills ADD COLUMN submitted_by TEXT; -- User ID who submitted
ALTER TABLE skills ADD COLUMN submitted_at TEXT; -- ISO timestamp
ALTER TABLE skills ADD COLUMN reviewed_by TEXT; -- Admin ID who reviewed
ALTER TABLE skills ADD COLUMN reviewed_at TEXT; -- ISO timestamp
ALTER TABLE skills ADD COLUMN rejection_reason TEXT; -- If rejected
```

**Status Values:**
- `pending_review` - Awaiting admin approval (default for user submissions)
- `approved` - Published and visible to all users
- `rejected` - Blocked from publication

#### 2. Create `skill_submissions` Table (Alternative Approach)

If you want to keep submitted skills separate from published skills:

```sql
CREATE TABLE skill_submissions (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,

  -- User info
  submitted_by TEXT NOT NULL, -- User ID
  submitted_at TEXT NOT NULL, -- ISO timestamp

  -- Skill content (from SKILL.md frontmatter)
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  license TEXT NOT NULL,
  allowed_tools TEXT NOT NULL,

  -- Metadata (from metadata.json)
  author TEXT NOT NULL,
  author_kind TEXT NOT NULL, -- 'community'
  source_type TEXT NOT NULL, -- 'submission'
  source_url TEXT,
  examples TEXT, -- JSON array

  -- Files
  zip_url TEXT NOT NULL, -- R2 storage URL
  thumbnail_url TEXT,

  -- Review workflow
  status TEXT NOT NULL DEFAULT 'pending_review',
  reviewed_by TEXT, -- Admin user ID
  reviewed_at TEXT, -- ISO timestamp
  rejection_reason TEXT,

  -- Timestamps
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_skill_submissions_status ON skill_submissions(status);
CREATE INDEX idx_skill_submissions_submitted_by ON skill_submissions(submitted_by);
```

**Recommended Approach:** Use `skill_submissions` table to avoid mixing user-submitted (unvetted) skills with curated skills.

### API Endpoint Schema

#### Request: `POST /api/v1/skills`

```typescript
// Content-Type: multipart/form-data
{
  zipFile: File // Complete ZIP package created by frontend
}

// ZIP must contain:
// - SKILL.md (required)
// - metadata.json (required)
// - [additional files] (optional)
```

#### Response: Success (201 Created)

```typescript
{
  success: true,
  message: "Skill submitted successfully! It will be reviewed shortly.",
  submissionId: "sub_abc123",
  skillSlug: "my-awesome-skill"
}
```

#### Response: Error (422 Unprocessable Entity)

```typescript
{
  success: false,
  error: "Invalid skill package",
  code: "VALIDATION_ERROR",
  detail: {
    issues: [
      "Missing required file: SKILL.md",
      "Invalid frontmatter: 'name' field is required"
    ]
  }
}
```

### Backend Handler Flow

```typescript
// apps/worker/src/application/handlers/skills/submit-skill.handler.ts

export async function submitSkill(command: SubmitSkillCommand, env: Env) {
  // 1. Authentication check
  if (!command.userId) {
    throw new UnauthorizedError('Authentication required');
  }

  // 2. Download and extract ZIP
  const zipBuffer = await command.zipFile.arrayBuffer();
  const zip = await JSZip.loadAsync(zipBuffer);

  // 3. Extract SKILL.md
  const skillMdFile = zip.file('SKILL.md');
  if (!skillMdFile) {
    throw new ValidationError('SKILL.md is required');
  }
  const skillMdContent = await skillMdFile.async('text');

  // 4. Parse frontmatter
  const { data: frontmatter, content } = matter(skillMdContent);

  // 5. Validate frontmatter schema
  const validatedFrontmatter = SkillFrontmatterSchema.parse(frontmatter);

  // 6. Extract metadata.json
  const metadataFile = zip.file('metadata.json');
  if (!metadataFile) {
    throw new ValidationError('metadata.json is required');
  }
  const metadata = JSON.parse(await metadataFile.async('text'));

  // 7. Generate slug and IDs
  const slug = slugify(validatedFrontmatter.name);
  const submissionId = `sub_${nanoid()}`;

  // 8. Upload ZIP to R2
  const zipKey = `submissions/${submissionId}/${slug}.zip`;
  await env.R2.put(zipKey, zipBuffer);

  // 9. Generate thumbnail (optional, can be async)
  const thumbnailUrl = await generateThumbnail(validatedFrontmatter.name);

  // 10. Insert to database with pending status
  await db.insert(skillSubmissions).values({
    id: submissionId,
    slug,
    submitted_by: command.userId,
    submitted_at: new Date().toISOString(),
    name: validatedFrontmatter.name,
    description: validatedFrontmatter.description,
    license: validatedFrontmatter.license,
    allowed_tools: validatedFrontmatter.allowedTools,
    author: metadata.author,
    author_kind: 'community',
    source_type: 'submission',
    source_url: metadata.sourceUrl,
    examples: JSON.stringify(metadata.examples),
    zip_url: `${env.R2_PUBLIC_URL}/${zipKey}`,
    thumbnail_url: thumbnailUrl,
    status: 'pending_review',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // 11. Return success
  return {
    success: true,
    message: 'Skill submitted successfully! It will be reviewed shortly.',
    submissionId,
    skillSlug: slug,
  };
}
```

### Required Zod Schemas

```typescript
// Skill name validation (hyphen-case format)
const SkillNameSchema = z.string()
  .min(3)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Must be lowercase alphanumeric with hyphens');

// Frontmatter validation (matches official spec)
const SkillFrontmatterSchema = z.object({
  // Required fields
  name: SkillNameSchema,
  description: z.string()
    .min(50, 'Must describe when Claude should use this skill')
    .max(500),

  // Optional fields
  license: z.string().optional(),
  'allowed-tools': z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

// Metadata validation
const SkillMetadataSchema = z.object({
  author: z.string().min(1).max(100),
  authorKind: z.literal('community'),
  sourceType: z.literal('submission'),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  examples: z.array(z.string().max(200)).min(0).max(10),
  curatorNote: z.null(),
});

// File category validation
const FileCategorySchema = z.enum(['scripts', 'references', 'assets', 'root']);

// Complete submission validation
const SkillSubmissionSchema = z.object({
  skillName: SkillNameSchema,
  displayName: z.string().min(3).max(100),
  description: z.string().min(50).max(500),
  skillMdContent: z.string().min(100, 'SKILL.md must have at least 50 chars of instructions'),
  files: z.array(z.object({
    file: z.instanceof(File),
    category: FileCategorySchema,
  })).max(20),
  license: z.string().default('MIT'),
  allowedTools: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  examples: z.array(z.string().max(200)).min(0).max(10),
});
```

### Admin Review Endpoints (Future)

```typescript
// GET /api/v1/admin/submissions?status=pending_review
// List pending submissions (admin only)

// POST /api/v1/admin/submissions/:id/approve
// Approve submission → copy to skills table

// POST /api/v1/admin/submissions/:id/reject
// Reject submission with reason
```

### Public Query Filtering

```typescript
// GET /api/v1/skills
// Only return approved skills from skills table
// Never return pending/rejected submissions

const skills = await db
  .select()
  .from(skills)
  .where(eq(skills.status, 'approved'));
```

## Future Enhancements

1. **Admin Review Dashboard** - UI for reviewing pending submissions
2. **Email Notifications** - Notify users when submission approved/rejected
3. **Draft Saving** - Save work in progress locally
4. **Skill Testing** - Test skill before submission
5. **Version Control** - Update existing skills
6. **Malware Scanning** - Scan ZIP contents for security issues
7. **Rate Limiting** - Prevent spam submissions

## Resources

- [Official Anthropic Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [How to Create Skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Skills Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
