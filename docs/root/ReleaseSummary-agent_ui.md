## Changes" with the bullet points. Each bullet starts with [bugfix], description by the user and PR link. Then the full changelog link.

Yes, that's correct. So putting it all together:

Version line: v0.1.56
Tag: v0.1.56
Commit: develop
Date: 2025-05-27

Then the changes bullet, and the full changelog link.

Make sure the bullet has the exact PR number and correct links. Also, the commit hash as "develop" is a bit unusual, but since that's what's provided, I'll go with that. Typically, a commit hash is a string like "abc123", but here it's "develop", which might refer to a branch. Maybe it's a typo, but the user wants to include it as is.

Okay, putting it all together now.
</think>

```markdown
v0.1.56
Tag: v0.1.56
Commit: develop
Date: 2025-05-27

## Changes
- [bugfix] Handle null/empty footprint or bbox by @davidKlein-7 [PR #212](https://github.com/getappsh/agent-ui/pull/212)

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)
```