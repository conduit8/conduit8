# Skill Submission Flow V2 (Redesigned)

## Overview

This is the redesigned skill submission flow that matches how Claude Skills actually work in practice. Users can write/upload SKILL.md content, add optional supporting files, provide metadata, and the frontend creates the ZIP package automatically.

## What Changed

### ❌ Old Flow (V1)
- User had to create ZIP package manually
- Upload pre-made ZIP file
- Metadata embedded in ZIP
- Not user-friendly

### ✅ New Flow (V2)
- User writes/pastes SKILL.md content OR uploads SKILL.md file
- User can add optional supporting files (scripts, resources, templates)
- User provides metadata via form fields
- **Frontend creates ZIP package automatically**
- Much more user-friendly!

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

## New Form Structure

### 1. SKILL.md Section
- **Textarea** for writing/pasting content
- **Upload button** for SKILL.md file
- **Live validation** of frontmatter
- **Preview** of parsed frontmatter fields
- Visual feedback for valid/invalid frontmatter

Required frontmatter fields:
- `name` (3-100 chars)
- `description` (20-500 chars)
- `license` (e.g., MIT, Apache-2.0)
- `allowed-tools` (space-separated list)

### 2. Additional Files Section (Optional)
- **Multi-file upload** for scripts, resources, templates
- **File list** showing name and size
- **Remove button** for each file
- Max 20 files, 5MB each

### 3. Metadata Section
- **Author** (text input, pre-filled from user profile)
- **Source URL** (optional, link to GitHub/docs)
- **Examples** (tags input, 1-10 example use cases)

## Client-Side ZIP Creation

The frontend creates the ZIP package using `JSZip`:

```typescript
skill.zip
├── SKILL.md                    # User-provided content
├── metadata.json               # Generated from form fields
└── [additional files...]       # User-uploaded files
```

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

## Migration Guide

### For Frontend

1. Replace old dialog with new one:
```diff
- import { SubmitSkillDialog } from './components/submit-skill-dialog';
+ import { SubmitSkillDialogV2 } from './components/submit-skill-dialog';

- <SubmitSkillDialog open={isOpen} onOpenChange={setIsOpen} />
+ <SubmitSkillDialogV2 open={isOpen} onOpenChange={setIsOpen} userEmail={user?.email} />
```

2. Install dependencies:
```bash
pnpm add jszip --filter @conduit8/web
pnpm add -D @types/jszip --filter @conduit8/web
```

### For Backend

**No changes required!** The backend already expects ZIP files with SKILL.md and metadata.json. The only difference is that the frontend now creates these instead of the user.

## Validation

### Frontend Validation

**SKILL.md Content:**
- Must contain YAML frontmatter (enclosed in `---`)
- Must have `name` field (string)
- Must have `description` field (string)
- Must have `license` field (string)
- Must have `allowed-tools` field (string)

**Additional Files:**
- Max 20 files
- Each file max 5MB

**Metadata:**
- Author: 1-100 chars
- Source URL: Valid URL or empty
- Examples: 1-10 items

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

## Example Submission

**User fills:**
```yaml
---
name: code-reviewer
description: Reviews code for best practices, security issues, and performance improvements
license: MIT
allowed-tools: Bash Read Grep Edit Write
---

# Code Reviewer

## Instructions
1. Read the code files in the project
2. Analyze for security vulnerabilities
3. Check for performance issues
4. Suggest improvements with examples

## Examples
- Review React components for common pitfalls
- Check API endpoints for security issues
- Analyze database queries for N+1 problems
```

**User uploads (optional):**
- `checklist.md` - Review checklist
- `templates/review-template.md` - Review report template

**User provides metadata:**
- Author: "John Doe"
- Source URL: "https://github.com/johndoe/code-reviewer-skill"
- Examples: ["Review React code", "Check API security", "Optimize SQL queries"]

**Frontend creates:**
```
skill.zip
├── SKILL.md (user content)
├── metadata.json (generated)
├── checklist.md (user uploaded)
└── templates/
    └── review-template.md (user uploaded)
```

**Result:**
✅ ZIP uploaded to backend
✅ Skill processed and stored
✅ Available in skills marketplace

## Testing Checklist

- [ ] SKILL.md validation works correctly
- [ ] Can write SKILL.md in textarea
- [ ] Can upload SKILL.md file
- [ ] Frontmatter preview shows correct data
- [ ] Validation errors display properly
- [ ] Can upload additional files
- [ ] Can remove additional files
- [ ] File size limits enforced
- [ ] Metadata fields validate correctly
- [ ] Tags input works for examples
- [ ] ZIP creation works correctly
- [ ] ZIP contains all expected files
- [ ] API upload succeeds
- [ ] Backend processes ZIP correctly
- [ ] Success toast appears
- [ ] Dialog closes on success
- [ ] Error handling works
- [ ] Mobile responsive design

## Future Enhancements

1. **SKILL.md Template Generator** - Wizard to help create frontmatter
2. **Rich Markdown Editor** - Syntax highlighting, preview mode
3. **File Browser** - Organize files in folders within ZIP
4. **Skill Validator** - Pre-submit validation with Claude AI
5. **Draft Saving** - Save work in progress
6. **Skill Testing** - Test skill before submission
7. **Batch Import** - Import multiple skills from GitHub repo
8. **Version Control** - Update existing skills
9. **Review Status Dashboard** - Track submission status

## Resources

- [Official Anthropic Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [How to Create Skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Skills Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
