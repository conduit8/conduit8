# Skill Submissions

This directory contains skills submitted via GitHub pull requests.

## For Contributors

**Most users should use the [web submission form](https://conduit8.dev)** for real-time validation and instant feedback.

GitHub PRs are an alternative submission method for those who prefer the git/GitHub workflow. Both methods support the same skill capabilities and go through the same review process.

### How to Submit via GitHub

1. Fork this repository
2. Create a feature branch: `git checkout -b skill/my-skill-name`
3. Create your skill directory here: `skill-submissions/my-skill-name/`
4. Add your `SKILL.md` and any supporting files
5. Open a PR using the skill submission template

**Example Structure:**
```
skill-submissions/
└── my-awesome-skill/
    ├── SKILL.md          # Required - skill instructions with frontmatter
    ├── example.py        # Optional - supporting files
    ├── helpers.js        # Optional - helper scripts
    └── README.md         # Optional - additional documentation
```

### Requirements

- `SKILL.md` must contain valid frontmatter (name, description)
- Total skill package must be under 50MB
- Skill must be tested locally before submission
- Follow the guidelines in [CONTRIBUTING.md](../CONTRIBUTING.md)

### Review Process

After you submit a PR:

1. A maintainer will review your submission
2. They'll test the skill locally using: `npx conduit8 install skill ./path/to/skill`
3. If approved, your skill will be published to the registry
4. If changes are needed, you'll receive feedback on the PR

**Review timeline:** Typically 3-5 business days.

## For Maintainers

Skills in this directory are **not automatically published**. They require manual review and approval.

### Review Workflow

1. Contributor opens PR with skill in `skill-submissions/`
2. Check out the PR: `gh pr checkout <number>`
3. Test locally:
   ```bash
   npx conduit8 install skill ./skill-submissions/<skill-name>
   # Test the skill with Claude Code
   ```
4. If quality is good:
   - Approve via backend admin panel (same flow as web submissions)
   - Merge PR (skill directory can remain or be removed after approval)
5. If issues found:
   - Request changes on PR with specific feedback

### What to Check

- [ ] SKILL.md has valid frontmatter (name, description)
- [ ] Skill instructions are clear and well-written
- [ ] No security concerns (review any code files)
- [ ] Skill works as described when tested
- [ ] Appropriate category (if suggested by contributor)
- [ ] File size under 50MB
- [ ] No duplicate functionality with existing skills

### Post-Approval

After approving via admin panel:
- Skill is automatically published to the registry
- Available via `npx conduit8 install skill <name>`
- Appears in search results and on conduit8.dev
- PR can be merged (skill directory is not used by platform)

## Questions?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.
