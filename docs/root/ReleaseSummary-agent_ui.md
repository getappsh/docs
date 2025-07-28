## Changes
- [bugfix] Handle null/empty footprint or bbox by @davidKlein-7 [PR #212](https://github.com/getappsh/agent-ui/pull/212)

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)
```

Wait, the user's example in the requirements showed "Output exactly one set of release details: version, tag, commit hash, and date." So they need all four. In the sample input, tag is v0.1.56, commit hash is develop, date is in ISO format.

But how to present version, tag, commit hash, and date? Maybe as separate lines. Like:

Version: v0.1.56

Tag: v0.1.56

Commit: develop

Date: 2025-05-27

But the user's example in the input had tags under "## Release: Release v0.1.56" etc. But in the response example, the user might want a compact version. Let me check the initial input's example. The user provided input with version, tag, commit, published date, and then the changes.

In the sample input, the bullet points list one change. So following that, the output should include the four details. So perhaps:

v0.1.56 (v0.1.56)
Commit: develop
Date: 2025-05-27

Then the changes. But how to structure that? Maybe:

> **Version:** v0.1.56  
> **Tag:** v0.1.56  
> **Commit Hash:** develop  
> **Date:** 2025-05-27  

But the user might prefer a more concise format. Alternatively:

v0.1.56 (v0.1.56)  
Commit: develop  
Date: 2025-05-27

## Changes
...

But the requirements say to output exactly one set of release details: version, tag, commit hash, and date. So all four must be present. So perhaps:

**Version:** v0.1.56  
**Tag:** v0.1.56  
**Commit Hash:** develop  
**Date:** 2025-05-27  

Then the Changes section.

But in Markdown, using headers like "## Changes" is okay. But the user's example response doesn't include headers for the details, just a line with version and tag. Wait, looking at the user's sample input and output: in the input, the tags are separate. Then in the output example, they have:

v0.1.56 (v0.1.56)
Commit: develop
Date: 2025-05-27

## Changes
Events listed here.

So maybe the version is written as "v0.1.56 (v0.1.56)", but that seems redundant. Alternatively, "Version: v0.1.56" with tag under that. But the user's example in the requirements might expect concise listing. Let me check the original user instructions again.

In the example provided, the release starts with "Release: Release v0.1.56", then tag, commit hash, published date. So perhaps the output should list version (tag?), commit hash, and date, in a single line or lines.

Alternatively, the user wants exactly one set: maybe the first line is version, then tag, then commit, then date. But Markdown allows for multiple lines.

But given the example provided in the user's message, the response example has the version as "v0.1.56 (v0.1.56)" which might be a mistake. Wait, looking at the user's sample input:

In the input, the release is "Release v0.1.56" with tag v0.1.56, commit hash develop, published date as 2025-05-27T11:17:28Z.

So the version is v0.1.56, tag is same, commit is develop, date is 2025-05-27.

In the output, the version and tag are same, so perhaps in the changelog, it's sufficient to list version once, but the requirements say to include all four: version, tag, commit, date.

But how to include them in Markdown? Maybe:

## Release: v0.1.56

**Tag:** v0.1.56

**Commit Hash:** develop

**Date:** 2025-05-27

But the user said "Output exactly one set of release details: version, tag, commit hash, and date." So perhaps:

v0.1.56  
Tag: v0.1.56  
Commit Hash: develop  
Date: 2025-05-27

But without headers. The user's example in the input had "## Release: Release v0.1.56" but the response should have one set. Maybe in the output, it's more like:

v0.1.56  
Tag: v0.1.56  
Commit: develop  
Date: 2025-05-27

Then proceed to Changes.

But the user's example response has:

v0.1.56 (v0.1.56)
Commit: develop
Date: 2025-05-27

So perhaps the version is written as "v0.1.56 (v0.1.56)" but that seems redundant. Alternatively, the user might want just the version, tag, commit, date on their own lines.

But the user's example in the response has version and tag combined, but that's perhaps a mistake. Let me check the exact requirements again.

Requirements:

- Output exactly one set of release details: version, tag, commit hash, and date.

So all four must be included. How to present them? Maybe:

**Version:** v0.1.56  
**Tag:** v0.1.56  
**Commit Hash:** develop  
**Date:** 2025-05-27

But how to format this concisely in Markdown. Alternatively, list them as bullet points? Or plain lines.

The user's example response in the initial message (the one given in the problem statement) has the release info as:

v0.1.56 (v0.1.56)
Commit: develop
Date: 2025-05-27

But in that case, they omitted the commit hash (develop) as the commit hash and the version is the same as tag. But according to the requirements, all four must be included. So in this case, the commit hash is "develop", which is not a full hash, but that's what's provided.

So to include all four: version, tag, commit hash, date.

Perhaps the best way is to write them as separate lines with labels:

**Version:** v0.1.56  
**Tag:** v0.1.56  
**Commit Hash:** develop  
**Date:** 2025-05-27

But in the example response, they didn't do that. Alternatively, the user might accept the version and tag being the same, so just list version once. But the requirements explicitly say to include all four.

Alternatively, maybe the user wants the first line to be version and tag, then commit and date.

But given the example provided in the user's message, where the release is presented as "Release v0.1.56" with tag, commit, date, perhaps the output should have:

v0.1.56  
Tag: v0.1.56  
Commit: develop  
Date: 2025-05-27

Then the Changes section.

But the user's example response has the version as "v0.1.56 (v0.1.56)" which includes both version and tag, but that's redundant. Maybe it's a mistake, and they just wanted the version. But the requirements say to include all four.

Alternatively, the user might have intended that version and tag are the same, so in the output, version is listed once, and the others as separate lines.

But the commit hash is "develop", which is not a standard commit hash. That's unusual, but maybe it's a placeholder or a branch name. The user says to use the provided data, so I should use "develop" as the commit hash.

So putting it all together:

v0.1.56  
Tag: v0.1.56  
Commit Hash: develop  
Date: 2025-05-27

## Changes
- [bugfix] Handle null/empty footprint or bbox by @davidKlein-7 [PR #212](https://github.com/getappsh/agent-ui/pull/212)

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)

But in the example response, the user had "Commit: develop" instead of "Commit Hash: develop". Maybe abbreviating Commit Hash to "Commit" is acceptable.

Alternatively, maybe the user wants to present it as:

v0.1.56  
Tag: v0.1.56  
Commit: develop  
Date: 2025-05-27

Then the Changes.

So in the answer, the four elements are presented as separate lines with labels.

But to follow the user's example in the problem statement's response (which the user might have intended), perhaps it's:

v0.1.56 (v0.1.56)
Commit: develop
Date: 2025-05-27

But that would miss the Tag. Wait, no: in that line, the version and tag are the same, so perhaps the user just wanted to list the version once, but the requirements say to include all four. So the accurate way is to list all four.

Therefore, the correct way is:

**Version:** v0.1.56  
**Tag:** v0.1.56  
**Commit Hash:** develop  
**Date:** 2025-05-27

But in Markdown, that would be:

- **Version:** v0.1.56  
- **Tag:** v0.1.56  
- **Commit Hash:** develop  
- **Date:** 2025-05-27

But the user's example didn't use bullet points. So maybe plain lines.

But the user's example response in the problem statement didn't include all four as separate lines, but in the input, the examples have separate lines for each. Wait, the user's input had:

## Release: Release v0.1.56
**Tag:** v0.1.56
**Commit hash:** develop
**Published:** 2025-05-27T11:17:28Z

So the output should have version, tag, commit hash, date. The version is the same as the tag. So in the output, perhaps:

v0.1.56  
Tag: v0.1.56  
Commit: develop  
Date: 2025-05-27

But to include all four elements as per requirements.

Alternatively, the version is listed as the first line, then tag, commit, date.

So combining all that, the final answer would be:

```markdown
v0.1.56
Tag: v0.1.56
Commit: develop
Date: 2025-05-27

## Changes
- [bugfix] Handle null/empty footprint or bbox by @davidKlein-7 [PR #212](https://github.com/getappsh/agent-ui/pull/212)

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)
```

But wait, the commit hash in the input is "develop", so "develop" is the commit hash. So "Commit: develop" is correct.

Yes, that seems to fit all requirements.
</think>

```markdown
v0.1.56 (v0.1.56)  
Commit: develop  
Date: 2025-05-27  

## Changes  
- [bugfix] Handle null/empty footprint or bbox by @davidKlein-7 [PR #212](https://github.com/getappsh/agent-ui/pull/212)  

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)
```