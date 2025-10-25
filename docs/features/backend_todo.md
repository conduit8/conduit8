# Backend Security Implementation Checklist

## Critical Security Tasks for Backend

These security measures should be implemented on the backend to complement the frontend validation. The frontend provides a good first line of defense, but **never trust client input**.

---

## 🔴 Critical Priority (Must Have Before Production)

### 1. Re-Validate All Frontend Inputs

**Why:** Never trust client-side validation - it can be bypassed

**Implementation:**
```typescript
// In ingest-skill.handler.ts
import { submitSkillFormSchema, ALLOWED_FILE_EXTENSIONS } from '@conduit8/core';

// After extracting ZIP, validate the entire structure
const validation = submitSkillFormSchema.safeParse({
  skillMdContent: skillMdContent,
  additionalFiles: zipEntries, // Check all files
  author: metadata.author,
  sourceUrl: metadata.sourceUrl,
  examples: metadata.examples,
});

if (!validation.success) {
  throw new InvalidSkillMetadataError('Validation failed', validation.error);
}
```

**Files to modify:**
- `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`

---

### 2. File Content-Type Verification

**Why:** Users can rename `.exe` to `.js` - check actual file content, not just extension

**Implementation:**
```typescript
import { fromBuffer } from 'file-type';

// For each file in ZIP
const buffer = entry.getData();
const fileType = await fromBuffer(buffer);

// Verify extension matches actual content
if (fileType && !isAllowedMimeType(fileType.mime)) {
  throw new InvalidSkillMetadataError(
    `File ${entry.name} has suspicious content type: ${fileType.mime}`
  );
}

const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/markdown',
  'text/html',
  'text/css',
  'application/json',
  'application/javascript',
  'application/xml',
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  // etc.
];
```

**Dependencies:**
```bash
pnpm add file-type --filter @conduit8/worker
```

**Files to modify:**
- `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`

---

### 3. Markdown Sanitization (XSS Prevention)

**Why:** SKILL.md content is displayed to users - prevent XSS attacks via malicious markdown

**Implementation:**
```typescript
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

// Before storing or displaying markdown
const sanitizeMarkdown = (markdown: string): string => {
  // Parse markdown to HTML
  const html = marked.parse(markdown);

  // Sanitize HTML (remove scripts, event handlers, etc.)
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'code', 'pre', 'a', 'strong', 'em'],
    ALLOWED_ATTR: ['href', 'title'],
  });

  return clean;
};

// Apply to SKILL.md content before storing
const sanitizedContent = sanitizeMarkdown(skillMdContent);
```

**Dependencies:**
```bash
pnpm add isomorphic-dompurify marked --filter @conduit8/worker
```

**Files to modify:**
- `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`
- Or create new service: `apps/worker/src/domain/services/markdown-sanitizer.service.ts`

---

### 4. Rate Limiting

**Why:** Prevent spam submissions and DoS attacks

**Implementation:**

**Option A: Cloudflare Worker Rate Limiting (Recommended)**
```typescript
// In worker entry point
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(env),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 submissions per hour
  analytics: true,
});

// Before processing submission
const identifier = getUserId(request); // or IP address
const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

if (!success) {
  return new Response('Rate limit exceeded', {
    status: 429,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  });
}
```

**Option B: Simple D1-based rate limiting**
```typescript
// Check submissions in last hour
const recentSubmissions = await env.D1
  .prepare('SELECT COUNT(*) as count FROM skills WHERE author = ? AND createdAt > ?')
  .bind(author, new Date(Date.now() - 3600000).toISOString())
  .first();

if (recentSubmissions.count >= 10) {
  throw new Error('Rate limit exceeded: max 10 submissions per hour');
}
```

**Dependencies (Option A):**
```bash
pnpm add @upstash/ratelimit @upstash/redis --filter @conduit8/worker
```

**Files to modify:**
- `apps/worker/src/index.ts` (rate limit middleware)
- Or in `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`

---

### 5. ZIP Bomb Protection

**Why:** Malicious users could upload ZIPs that expand to gigabytes (DoS attack)

**Implementation:**
```typescript
const MAX_UNCOMPRESSED_SIZE = 50 * 1024 * 1024; // 50MB uncompressed
let totalUncompressedSize = 0;

// While extracting ZIP
for (const entry of zip.getEntries()) {
  totalUncompressedSize += entry.header.size;

  if (totalUncompressedSize > MAX_UNCOMPRESSED_SIZE) {
    throw new InvalidSkillMetadataError(
      'ZIP file too large when uncompressed (possible ZIP bomb)'
    );
  }
}

// Also check compression ratio (if > 100:1, likely a ZIP bomb)
const compressionRatio = totalUncompressedSize / zipBuffer.byteLength;
if (compressionRatio > 100) {
  throw new InvalidSkillMetadataError(
    'Suspicious compression ratio detected'
  );
}
```

**Files to modify:**
- `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`

---

## 🟡 High Priority (Strongly Recommended)

### 6. Virus/Malware Scanning

**Why:** Prevent malicious files from being stored and distributed

**Implementation Options:**

**Option A: ClamAV (Self-hosted)**
```typescript
import { ClamScan } from 'clamscan';

const clamscan = await new ClamScan().init({
  clamdscan: {
    host: env.CLAMAV_HOST,
    port: 3310,
  },
});

// Scan each file
for (const entry of zip.getEntries()) {
  const buffer = entry.getData();
  const { isInfected, viruses } = await clamscan.scanBuffer(buffer);

  if (isInfected) {
    throw new InvalidSkillMetadataError(
      `Malware detected: ${viruses.join(', ')}`
    );
  }
}
```

**Option B: VirusTotal API (Cloud service)**
```typescript
import fetch from 'node-fetch';

async function scanWithVirusTotal(fileBuffer: Buffer): Promise<boolean> {
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]));

  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: { 'x-apikey': env.VIRUSTOTAL_API_KEY },
    body: formData,
  });

  const result = await response.json();
  return result.data.attributes.stats.malicious === 0;
}
```

**Option C: Cloudflare Gateway (If using Cloudflare)**
- Configure in Cloudflare dashboard
- Automatic scanning for all uploads

**Dependencies:**
```bash
# Option A
pnpm add clamscan --filter @conduit8/worker

# Option B
pnpm add node-fetch --filter @conduit8/worker
```

**Files to modify:**
- Create new service: `apps/worker/src/domain/services/malware-scanner.service.ts`
- Use in `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`

---

### 7. Script Static Analysis (Optional but Good)

**Why:** Detect suspicious patterns in scripts before storing

**Implementation:**
```typescript
// Simple pattern matching for dangerous commands
const SUSPICIOUS_PATTERNS = [
  /rm\s+-rf\s+\//, // Dangerous rm commands
  /curl.*\|\s*bash/, // Pipe to bash
  /wget.*\|\s*sh/, // Pipe to shell
  /eval\s*\(/, // Eval in JS/Python
  /exec\s*\(/, // Exec in Python
  /__import__\s*\(\s*['"]os['"]/, // Python os import
  /base64.*decode/, // Obfuscated code
];

function analyzeScript(content: string, fileName: string): string[] {
  const warnings: string[] = [];

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      warnings.push(`Suspicious pattern in ${fileName}: ${pattern.source}`);
    }
  }

  return warnings;
}

// In handler
const warnings = analyzeScript(fileContent, fileName);
if (warnings.length > 0) {
  console.warn('[Security] Suspicious script detected', { warnings });
  // Option: Reject submission or flag for manual review
  skill.curatorNote = `Auto-flagged: ${warnings.join('; ')}`;
}
```

**Files to modify:**
- Create new service: `apps/worker/src/domain/services/script-analyzer.service.ts`
- Use in `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`

---

### 8. Path Traversal Validation (Double-Check)

**Why:** Verify frontend sanitization worked correctly

**Implementation:**
```typescript
// Validate all ZIP entry paths
for (const entry of zip.getEntries()) {
  const entryName = entry.entryName;

  // Reject paths with directory traversal
  if (entryName.includes('..') || entryName.includes('//') || entryName.startsWith('/')) {
    throw new InvalidSkillMetadataError(
      `Invalid file path: ${entryName}`
    );
  }

  // Reject absolute paths
  if (entryName.startsWith('/') || /^[A-Z]:\\/.test(entryName)) {
    throw new InvalidSkillMetadataError(
      `Absolute paths not allowed: ${entryName}`
    );
  }
}
```

**Files to modify:**
- `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`

---

## 🟢 Medium Priority (Nice to Have)

### 9. Content Security Policy (CSP) Headers

**Why:** Additional XSS protection when displaying skills

**Implementation:**
```typescript
// When serving skill content
return new Response(html, {
  headers: {
    'Content-Security-Policy':
      "default-src 'self'; " +
      "script-src 'none'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "connect-src 'self'; " +
      "frame-ancestors 'none';",
  },
});
```

**Files to modify:**
- API response headers in skill detail endpoint

---

### 10. SKILL.md YAML Bomb Protection

**Why:** Malicious YAML can cause DoS (e.g., billion laughs attack)

**Implementation:**
```typescript
import matter from 'gray-matter';

// Set limits for YAML parsing
const MAX_YAML_SIZE = 10 * 1024; // 10KB for frontmatter

const frontmatterMatch = skillMdContent.match(/^---\n([\s\S]*?)\n---/);
if (frontmatterMatch) {
  const yamlContent = frontmatterMatch[1];

  if (yamlContent.length > MAX_YAML_SIZE) {
    throw new InvalidSkillMetadataError('Frontmatter too large');
  }

  // Check for YAML bombs (excessive references)
  const referenceCount = (yamlContent.match(/&\w+/g) || []).length;
  const aliasCount = (yamlContent.match(/\*\w+/g) || []).length;

  if (referenceCount > 10 || aliasCount > 100) {
    throw new InvalidSkillMetadataError('Suspicious YAML structure');
  }
}

const { data } = matter(skillMdContent);
```

**Files to modify:**
- `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`

---

### 11. Logging and Monitoring

**Why:** Detect and respond to security incidents

**Implementation:**
```typescript
// Log all submissions for audit trail
console.log('[SkillSubmission]', {
  author: metadata.author,
  sourceUrl: metadata.sourceUrl,
  fileCount: additionalFiles.length,
  totalSize: zipBuffer.byteLength,
  timestamp: new Date().toISOString(),
  userId: request.userId, // If available
  ipAddress: request.headers.get('CF-Connecting-IP'),
});

// Alert on suspicious activity
if (warnings.length > 0) {
  await sendSecurityAlert({
    type: 'suspicious_skill_submission',
    severity: 'medium',
    details: warnings,
    author: metadata.author,
  });
}
```

**Files to modify:**
- `apps/worker/src/application/handlers/skills/ingest-skill.handler.ts`
- Add alerting service: `apps/worker/src/infrastructure/services/alerts.service.ts`

---

### 12. Manual Review Queue (Highly Recommended)

**Why:** Allow human review of flagged submissions

**Implementation:**
```typescript
// Add status field to skills table
enum SkillStatus {
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// On submission
const needsReview = warnings.length > 0 ||
                    totalSize > 10 * 1024 * 1024 ||
                    additionalFiles.length > 10;

const status = needsReview ? SkillStatus.PENDING_REVIEW : SkillStatus.APPROVED;

// Store with status
await repo.insert(skill, zipBuffer, status);

// Only show approved skills publicly
const skills = await repo.findAll({ status: SkillStatus.APPROVED });
```

**Database migration:**
```sql
ALTER TABLE skills ADD COLUMN status TEXT DEFAULT 'approved';
CREATE INDEX idx_skills_status ON skills(status);
```

**Files to modify:**
- `apps/worker/src/domain/models/skill.model.ts`
- `apps/worker/src/infrastructure/persistence/repositories/skill.repository.ts`
- Add admin dashboard for review queue

---

## 📊 Priority Summary

| Priority | Task | Effort | Impact | Status |
|----------|------|--------|--------|--------|
| 🔴 Critical | Re-validate inputs | Low | High | ⬜ Todo |
| 🔴 Critical | File content-type check | Medium | High | ⬜ Todo |
| 🔴 Critical | Markdown sanitization | Low | High | ⬜ Todo |
| 🔴 Critical | Rate limiting | Medium | High | ⬜ Todo |
| 🔴 Critical | ZIP bomb protection | Low | High | ⬜ Todo |
| 🟡 High | Virus scanning | High | Medium | ⬜ Todo |
| 🟡 High | Script analysis | Medium | Medium | ⬜ Todo |
| 🟡 High | Path traversal validation | Low | High | ⬜ Todo |
| 🟢 Medium | CSP headers | Low | Low | ⬜ Todo |
| 🟢 Medium | YAML bomb protection | Low | Low | ⬜ Todo |
| 🟢 Medium | Logging/monitoring | Medium | Medium | ⬜ Todo |
| 🟢 Medium | Manual review queue | High | High | ⬜ Todo |

---

## 🧪 Testing Security Measures

Create test cases for each security measure:

```typescript
// Test file type bypass
it('should reject .exe renamed to .js', async () => {
  const maliciousFile = createExeFile('malware.js');
  await expect(submitSkill(maliciousFile)).rejects.toThrow('suspicious content type');
});

// Test ZIP bomb
it('should reject ZIP bombs', async () => {
  const zipBomb = createZipBomb(); // 1MB → 10GB
  await expect(submitSkill(zipBomb)).rejects.toThrow('too large when uncompressed');
});

// Test XSS in markdown
it('should sanitize XSS in SKILL.md', async () => {
  const xssMarkdown = '# Title\n<script>alert("xss")</script>';
  const skill = await submitSkill(xssMarkdown);
  expect(skill.content).not.toContain('<script>');
});

// Test path traversal
it('should reject path traversal in file names', async () => {
  const maliciousZip = createZipWithPath('../../../etc/passwd');
  await expect(submitSkill(maliciousZip)).rejects.toThrow('Invalid file path');
});

// Test rate limiting
it('should enforce rate limits', async () => {
  for (let i = 0; i < 10; i++) {
    await submitSkill(validSkill);
  }
  await expect(submitSkill(validSkill)).rejects.toThrow('Rate limit exceeded');
});
```

---

## 📚 Additional Resources

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Cloudflare Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [ClamAV Documentation](https://docs.clamav.net/)

---

## ✅ Implementation Checklist

Before going to production:

- [ ] All 🔴 Critical tasks implemented
- [ ] All 🟡 High priority tasks reviewed (implement or document why skipped)
- [ ] Security tests passing
- [ ] Manual penetration testing completed
- [ ] Security audit by external team (if budget allows)
- [ ] Incident response plan documented
- [ ] Monitoring and alerting configured
- [ ] Rate limits tuned based on expected usage
- [ ] Admin review dashboard implemented (if using manual review)

---

**Estimated Implementation Time:**
- 🔴 Critical tasks: 1-2 days
- 🟡 High priority tasks: 2-3 days
- 🟢 Medium priority tasks: 2-3 days
- **Total: 5-8 days** for comprehensive security hardening
