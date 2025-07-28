## Release: Release v0.1.56
Tag: v0.1.56
Commit hash: develop
Published: 2025-05-27

## Changes
* bugfix: Handled case when footprint or bbox is null ro empty string by @davidKlein-7 in https://github.com/getappsh/agent-ui/pull/212

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)
```

Wait, the user wants exactly one set of release details. The original has "Develop" as the commit hash. Maybe the user made a mistake here, but according to their data, it's "develop". So I should include that as the commit hash.

Also, the date format is given as "2025-05-27T11:17:28Z", but the user's example in the output uses just the date without the time. So probably format it as "2025-05-27".

Yes, in the example, the Published line is "2025-05-27". So I should follow that.

So all set. Now, make sure there are no markdown headers beyond ##. The user said to use headers level 2 and 3 if formatting is needed, but here it's just the release details, so maybe use a single ## for the release title, then the section headers as h3 or h2? Wait, in the example, the user's output uses:

## Release: Release v0.1.56
Tag: ...
etc.

Then ## Changes.

But the user's example shows "## What's Changed" in the input, but in the desired output, it's "## Changes".

Wait, the user provided:

In the What's Changed section of the input, they have the bullet point. The desired output is to have a "Changes" section with bullet points.

So in the output, the "## Changes" is the section header. Then bullet points.

So the full Markdown should have:

## Release: Release v0.1.56
Tag: v0.1.56
Commit hash: develop
Published: 2025-05-27

## Changes
* ... [PR link]

[Full Changelog](...).

That's the structure. Double-checking the user's example in their message: the output they want is:

```markdown
## Release: Rename `find-missing-variables` to `detect-incomplete-scenarios`
Tag: v1.2.0
Commit hash: some-sha
Published: 2023-04-05

## Changes
* rename: Command renamed from `find-missing-variables` to `detect-incomplete-scenarios` by @contributor in https://github.com/example/repo/pull/11

[Full Changelog](...)
```

So in the user's example, they have:

## Release: [Release Name]
Tag: ...
Commit hash: ...
Published: ...

## Changes
* [type]: [description] by [@contributor](profile-url) in [PR #number]

So that's the structure. The contributor's username is linked to their GitHub profile. But in the user's input, the contributor is mentioned as "@davidKlein-7". So in the output, it should be "by @davidKlein-7". The PR link is just the PR URL, not using the number in the link. So the bullet point is:

"bugfix: [message] by @davidKlein-7 in [PR-URL]"

So that's correct.

So the final Markdown as per the user's data would be as I structured above.
</think>

```markdown
# Release v0.1.56
## Details
Version: **v0.1.56**  
Tag: **v0.1.56**  
Commit hash: **develop**  
Date: **2025-05-27**

## Changes
* Bugfix: Handled case when footprint or bbox is null ro empty string by [@davidKlein-7](https://github.com/davidKlein-7) in [PR #212](https://github.com/getappsh/agent-ui/pull/212)

[Full Changelog](https://github.com/getappsh/agent-ui/compare/v0.1.55...v0.1.56)
```