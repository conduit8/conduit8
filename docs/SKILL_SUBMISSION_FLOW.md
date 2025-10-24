# Skill Submission Flow

## Overview

This document describes the implementation of the skill submission flow, which allows users to submit skills via the UI in a secure and simple manner.

## Architecture

### Components

```
apps/web/src/pages/public/home/
├── components/
│   └── submit-skill-dialog/
│       ├── index.ts                        # Barrel export
│       ├── submit-skill-dialog.tsx         # Main dialog container
│       ├── submit-skill-form.tsx           # Form component
│       ├── submit-skill-form.schema.ts     # Zod validation schema
│       └── tags-input.tsx                  # Reusable tags input component
├── hooks/
│   ├── use-submit-skill.ts                 # React Query mutation hook
│   └── use-submit-skill-dialog.ts          # Dialog state management hook
└── services/
    └── skills-api.ts                       # API service (updated)
```

### Component Hierarchy

```
HomePage
├── HomeHeader (with Submit button)
└── SubmitSkillDialog
    └── SubmitSkillForm
        ├── Input (Display Name)
        ├── Textarea (Description)
        ├── Select (Category)
        ├── TagsInput (Allowed Tools)
        ├── TagsInput (Examples)
        └── Input[type=file] (ZIP Upload)
```

## Features

### 1. **Secure & Simple UI**
- Dialog-based modal interface
- Clean, responsive design
- Mobile-friendly with responsive variant
- User authentication required (redirects to login if not authenticated)

### 2. **Form Fields**

| Field | Type | Validation |
|-------|------|------------|
| Display Name | Text Input | 3-100 chars, alphanumeric + spaces/hyphens/underscores |
| Description | Textarea | 20-500 chars |
| Category | Select | One of: development, content, documents, data, design, marketing, business |
| Allowed Tools | Tags Input | Array of strings, 1-20 tools |
| Examples | Tags Input | Array of strings, 1-10 examples |
| ZIP File | File Upload | .zip file, max 10MB |

### 3. **Frontend Validation**

Validation is handled using Zod schema (`submit-skill-form.schema.ts`):

```typescript
{
  displayName: string (3-100 chars, regex pattern)
  description: string (20-500 chars)
  category: enum (SKILL_CATEGORIES)
  allowedTools: string[] (1-20 items)
  examples: string[] (1-10 items)
  zipFile: File (.zip, max 10MB)
}
```

### 4. **API Integration**

**Endpoint:** `POST /api/v1/skills`

**Request Format:** `multipart/form-data`

**Payload:**
```typescript
{
  displayName: string
  description: string
  category: string
  allowedTools: string[] (JSON-encoded)
  examples: string[] (JSON-encoded)
  zipFile: File (binary)
}
```

**Response:**
```typescript
{
  success: boolean
  message: string
  skillSlug?: string
}
```

### 5. **User Flow**

1. User clicks "Submit" button in header
2. If not authenticated → Sign In modal opens
3. If authenticated → Submit Skill dialog opens
4. User fills form and uploads ZIP file
5. Frontend validates input
6. On submit:
   - Form data is converted to FormData
   - POST request sent to backend
   - Loading state shown in submit button
7. On success:
   - Success toast notification
   - Dialog closes
   - Skills list is invalidated (refetches)
8. On error:
   - Error toast notification
   - Dialog remains open
   - User can retry

## State Management

### Dialog State
Managed by `useSubmitSkillDialog` hook:
```typescript
{
  isOpen: boolean
  open: () => void
  close: () => void
}
```

### Form State
Managed by React Hook Form with Zod validation:
```typescript
const form = useForm<SubmitSkillFormValues>({
  resolver: zodResolver(submitSkillFormSchema),
  defaultValues: { ... },
  mode: 'onSubmit',
});
```

### API State
Managed by React Query mutation hook:
```typescript
const mutation = useSubmitSkill();
// { mutateAsync, isPending, isError, error }
```

## Custom Components

### TagsInput Component

A reusable component for entering multiple string values:

**Features:**
- Type and press Enter to add tags
- Click X to remove tags
- Press Backspace on empty input to remove last tag
- Shows tag count (e.g., "3 / 10 tags")
- Uses Badge component for visual tags

**Props:**
```typescript
{
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}
```

## Security Considerations

1. **Authentication Required:** Users must be logged in to submit skills
2. **Frontend Validation:** All inputs are validated before submission
3. **File Type Validation:** Only .zip files are accepted
4. **File Size Limit:** Maximum 10MB file size
5. **Input Sanitization:** Display name regex prevents special characters
6. **Backend Validation:** Backend should re-validate all inputs (defense in depth)

## Backend Integration Notes

The backend should:

1. **Accept multipart/form-data** at `POST /api/v1/skills`
2. **Parse FormData:**
   - Extract text fields (displayName, description, category)
   - Parse JSON fields (allowedTools, examples)
   - Extract file (zipFile)
3. **Validate inputs:**
   - Re-validate all fields (don't trust client)
   - Check file type and size
   - Scan ZIP for malware
   - Validate ZIP structure (SKILL.md, metadata.json)
4. **Process ZIP:**
   - Extract SKILL.md and metadata.json
   - Generate slug from displayName (kebab-case)
   - AI categorization (if needed)
   - Generate images/videos/thumbnails
5. **Store skill:**
   - Upload ZIP to R2 storage
   - Insert metadata to D1 database
   - Set sourceType to 'submission'
   - Set authorKind to 'community'
6. **Return response:**
   - Success message
   - Generated skillSlug
   - Any additional metadata

## Testing Checklist

- [ ] Form validation works for all fields
- [ ] File upload accepts .zip files only
- [ ] File size limit is enforced (10MB)
- [ ] Tags input allows adding/removing tags
- [ ] Tags input enforces max tags limit
- [ ] Category dropdown shows all categories
- [ ] Submit button shows loading state
- [ ] Success toast appears on successful submission
- [ ] Error toast appears on failed submission
- [ ] Dialog closes on successful submission
- [ ] Dialog remains open on error
- [ ] Skills list refetches after submission
- [ ] Authentication check works (redirects to login if not authenticated)
- [ ] Mobile responsive design works
- [ ] Form resets after closing dialog
- [ ] All fields are required (except examples can be optional)

## Future Enhancements

1. **Skill Preview:** Show a preview of the skill before submission
2. **Draft Saving:** Allow users to save drafts and resume later
3. **Batch Upload:** Allow uploading multiple skills at once
4. **Skill Templates:** Provide templates for common skill types
5. **Rich Text Editor:** Use a rich text editor for description
6. **Tool Autocomplete:** Autocomplete tool names from a known list
7. **Example Validation:** Validate example format
8. **Progress Indicator:** Show upload progress for large files
9. **Skill Guidelines:** Add a link to skill submission guidelines
10. **Review Status:** Show submission status and review feedback

## Related Files

- `/packages/core/src/domain/skill-schemas.ts` - Skill domain types
- `/packages/core/src/contracts/http/skills.schemas.ts` - API contracts
- `/apps/worker/src/application/handlers/skills/ingest-skill.handler.ts` - Backend ingestion logic
- `/apps/web/src/pages/public/home/home.tsx` - Main home page
- `/apps/web/src/pages/public/home/home-header.tsx` - Header with Submit button

## Troubleshooting

### Form doesn't submit
- Check browser console for validation errors
- Ensure all required fields are filled
- Check file size (max 10MB)
- Check file type (.zip only)

### API returns error
- Check network tab for request/response
- Verify backend endpoint is correct
- Check backend logs for errors
- Verify authentication token is valid

### Dialog doesn't open
- Verify user is authenticated
- Check if `useSubmitSkillDialog` hook is called correctly
- Check if dialog state is managed correctly in HomePage
