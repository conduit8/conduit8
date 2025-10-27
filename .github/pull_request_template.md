## Pull Request Type

<!-- Check the type of change this PR introduces -->

- [ ] Skill Submission
- [ ] Bug Fix
- [ ] Feature
- [ ] Documentation
- [ ] Other (please describe):

## Description

<!-- Provide a clear description of what this PR does -->



---

## Skill Submission Details

<!-- Complete this section if submitting a skill -->

### Required Information

**Skill Name:** <!-- From SKILL.md frontmatter -->

**Category:** <!-- Select ONE: development, content, documents, data, design, marketing, business -->

**Description:** <!-- Brief description of what the skill does -->

### Submission Requirements

**Directory Structure:**
```
skill-submissions/
└── your-skill-name/
    ├── SKILL.md          # Required
    └── [other files]     # Optional
```

**SKILL.md Frontmatter (required fields):**
- `name`: Your skill name (1-100 characters)
- `description`: What the skill does (1-500 characters)

**Optional frontmatter fields:**
- `license`: e.g., MIT, Apache-2.0
- `allowed-tools`: Comma-separated tool names

### Validation Checklist

Please confirm your submission meets these requirements:

- [ ] SKILL.md contains valid YAML frontmatter with `name` and `description`
- [ ] Total size of all files in skill directory is under 50MB
- [ ] All skill files are in `/skill-submissions/<your-skill-name>/` directory
- [ ] Tested skill locally with Claude Code and verified it works
- [ ] Read and followed [CONTRIBUTING.md](../CONTRIBUTING.md)

**Maintainer will verify during review:**
- Skill name uniqueness
- Final functionality verification

---

## For Non-Skill PRs

### Testing

<!-- How has this been tested? What should reviewers test? -->



### Additional Context

<!-- Any other information relevant to this PR -->


