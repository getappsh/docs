## Changes
- bugfix: Handled case when footprint or bbox is null or empty string by @davidKlein-7 in [PR #212](https://github.com/getappsh/agent-ui/pull/212)

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)

Wait, the original says "ro empty string" – that's a typo, right? Should be "or empty string". But do I need to correct that? The user says to summarize as given, so I should keep the typo unless instructed to correct it. So I'll leave it as "null ro empty string".

Also, check if the date is formatted correctly. The input has 2025-05-27T11:17:28Z, which is ISO 8601, so using as is.

Are the PR URLs correctly linked? The original uses the PR URL, so the formatting should be correct.

Double-check requirements: only one bullet point here. No other changes. So the "Changes" section has one item.

Finally, end with the full changelog link as specified.

Everything seems to check out. Now format it as Markdown without any extra text, enclosed in triple backticks.
</think>

```markdown
## Release v0.1.56
**Version:** v0.1.56  
**Tag:** v0.1.56  
**Commit hash:** develop  
**Published:** 2025-05-27T11:17:28Z  

## Changes  
- bugfix: Handled case when footprint or bbox is null ro empty string by @davidKlein-7 in [PR #212](https://github.com/getappsh/agent-ui/pull/212)  

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)  
```