## v0.1.56
**Tag:** v0.1.56
**Commit hash:** develop
**Published:** 2025-05-27T11:17:28Z

## Changes
- bugfix: Handled case when footprint or bbox is null ro empty string by @davidKlein-7 [PR #212](https://github.com/getappsh/agent-ui/pull/212)

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)

Wait, but in the user's provided data, the commit hash is 'develop', which is a branch name. Typically, commit hashes are 7-character or longer hexadecimal strings. But maybe in this context, the commit hash is represented as the branch name. I should follow the input as given.

Also, the date is in ISO format, which is correct.

Check if the tag is the version number. In the user's input, the Tag is v0.1.56, same as the version.

Now, ensure that the Markdown is properly formatted with headers. The version is a header, but in the example, the user used '## Release: Release v0.1.56' but the instruction says to output exactly one set of release details. So maybe the section should be just the version as a heading.

Wait, the user's example shows:

## Release: Release v0.1.56
**Tag:** v0.1.56
**Commit hash:** develop
**Published:** 2025-05-27T11:17:28Z

So in their example, the header is "Release: Release v0.1.56", but perhaps in the output, it's better to just have the version as the header, without "Release: ".

But according to the requirements, the first line should be the version. Let me check the example again. The user's example starts with "## Release: Release v0.1.56", but the actual header should probably be just the version number with the tag as a subheader.

Alternatively, maybe the version is written as the header without the "Release" part. Looking at standard changelog formats, often the version is the main header. So perhaps the correct approach is:

### v0.1.56
**Tag:** v0.1.56
**Commit hash:** develop
**Published:** 2025-05-27T11:17:28Z

## Changes
...

But the user's example uses 'Release: Release v0.1.56' as the header. Since the user is likely following a specific template, I should replicate that structure.

Wait, the user's instruction says: "Output exactly one set of release details: version, tag, commit hash, and date." So perhaps the first line is the version, then the tag, commit hash, and date as separate lines, not in headers. But in their example, they used markdown headers for the release details.

Wait, looking at the user's example input:

## Release: Release v0.1.56
**Tag:** v0.1.56
**Commit hash:** develop
**Published:** 2025-05-27T11:17:28Z

## What's Changed
* bugfix: Handled case when footprint or bbox is null ro empty string by @davidKlein-7 in https://github.com/getappsh/agent-ui/pull/212

So the output needs to transform this into a Markdown changelog where the initial section is the version, tag, commit, and date, followed by the Changes section with bullet points linked to PRs, and ending with the full changelog link.

In the response, the user wants the output to be:

## v0.1.56
**Tag:** v0.1.56
**Commit hash:** develop
**Published:** 2025-05-27T11:17:28Z

## Changes
- bugfix: Handled case when footprint or bbox is null ro empty string by @davidKlein-7 [PR #212](https://github.com/getappsh/agent-ui/pull/212)

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)

That structure matches the requirements. The version is a header, then the details as bold lines. The Changes section is a separate header with bullet points. Each bullet has the PR linked as per the requirement.

I need to make sure that the bullet starts with the change type (bugfix, etc.), followed by the brief description, contributor handle, and PR link with number. Also, ensure no emojis, explanations, or repeated headers.

Double-check for any typos in the original input, like 'ro' instead of 'or' in 'ro empty string'—but that's part of the user's input, so I should keep it as is.

So the final Markdown should be as follows, enclosed in triple backticks.
</think>

```markdown
## v0.1.56
**Tag:** v0.1.56  
**Commit hash:** develop  
**Published:** 2025-05-27T11:17:28Z  

## Changes  
- bugfix: Handled case when footprint or bbox is null ro empty string by @davidKlein-7 [PR #212](https://github.com/getappsh/agent-ui/pull/212)  

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)  
```