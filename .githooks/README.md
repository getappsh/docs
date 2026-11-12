# Git Hooks (generic, stack-agnostic)

This folder contains **tracked** Git hook scripts. Unlike `.git/hooks/`, this
folder *is* committed and pushed - but Git still never auto-installs hooks
from a tracked folder (that would let a clone run arbitrary code, which is a
deliberate Git security decision). Each contributor has to opt in once per
clone:

```sh
git config core.hooksPath .githooks
```

After that, every `git push` in this clone runs [`pre-push`](./pre-push),
which scans the commits about to be pushed with [gitleaks](https://github.com/gitleaks/gitleaks)
(via Docker, so no Node/Python/Go toolchain is required - just Docker, which
this repo already depends on).

The hook is **fail-closed**: the push is aborted whenever the scan doesn't
pass - not only when gitleaks finds a secret, but also when Docker isn't
installed, the Docker daemon isn't running, or gitleaks can't run (e.g. the
image can't be pulled while offline). Each case prints its own error so you
know what to fix. Docker must be running for every push.

> **Hook not running on Linux/macOS/WSL?** If `git push` prints
> `hint: The '.githooks/pre-push' hook was ignored because it's not set as executable`,
> the push was **not** scanned. Run `chmod +x .githooks/pre-push` locally.
> The file is committed as executable (mode `100755`); if you add a new hook
> from Windows, stage it with `git add --chmod=+x .githooks/<hook>`, since
> Windows doesn't record the executable bit.

## Why this isn't "real" push protection

- This hook only runs locally, for contributors who've opted in, and can be
  bypassed with `git push --no-verify`.
- GitHub's native **push protection** (which blocks a secret server-side,
  before it's even accepted) is part of the paid *GitHub Secret Protection*
  product for private repos - it is not available for free on a private repo,
  even under a free org.
- The backstop that **cannot** be bypassed by a local developer is the
  `secret-scan` GitHub Actions workflow (`.github/workflows/secret-scan.yml`)
  combined with a required branch-protection status check on `main`/`develop`.

Use this hook for fast local feedback, and the Actions check for actual
enforcement.

## Testing the hooks (self-test script)

Copy the script for your shell below and paste it into a terminal at the
repo root to verify `core.hooksPath` and gitleaks actually work.

This test never pushes, creates branches, or creates a commit - it stages
a fake secret and runs `git hook run pre-commit` (Git's own built-in way to
invoke a hook on demand, exactly as it would for a real `git commit`), so
there's nothing to undo afterward and no risk of touching any commit or
staged file that isn't the test fixture itself.

What it does:

1. Verifies `core.hooksPath` is set to `.githooks` (hooks won't run
   otherwise) and that Docker is available.
2. Creates a temporary `pre-commit` hook (gitleaks via `protect --staged`)
   - this repo doesn't ship one permanently, so the test adds it just for
   this run and deletes it again at the end, regardless of outcome.
3. Writes a file containing a fake-but-gitleaks-detectable secret (an
   AWS-access-key-shaped string - not a real credential), and `git add`s it.
4. Runs `git hook run pre-commit` against the staged change (no
   `git commit` involved):
   - If gitleaks blocks it -> **PASS** - `core.hooksPath` and the hook are
     working.
   - If it doesn't -> **FAIL** - `core.hooksPath`/Docker/gitleaks isn't
     working as expected.
5. Unstages and deletes only the test file (whatever else you already had
   staged before running this is left untouched), and deletes the
   temporary `pre-commit` hook, printing a plain PASS/FAIL line to the
   console (no log file - git's and gitleaks' own output is shown directly
   as it runs).

A failed (blocked) run should still show gitleaks' own output above the
PASS/FAIL line - confirming it was actually gitleaks that blocked it, not an
unrelated error.

### Bash

```sh
githooks_selftest() { cd "$(git rev-parse --show-toplevel)" || return 1; GITLEAKS_IMAGE="zricethezav/gitleaks:v8.30.1"; TEST_FILE="githooks-selftest-secret.txt"; PRECOMMIT_HOOK=".githooks/pre-commit"; PRECOMMIT_CREATED=0; if [ "$(git config --get core.hooksPath)" != ".githooks" ]; then echo "FAIL: core.hooksPath is not set to .githooks (run: git config core.hooksPath .githooks)"; return 1; fi; command -v docker >/dev/null 2>&1 || { echo "FAIL: docker is not available"; return 1; }; if [ ! -f "$PRECOMMIT_HOOK" ]; then if command -v cygpath >/dev/null 2>&1; then REPO_DIR="$(cygpath -w "$(git rev-parse --show-toplevel)")"; else REPO_DIR="$(git rev-parse --show-toplevel)"; fi; printf '#!/bin/sh\nMSYS_NO_PATHCONV=1 docker run --rm -v "%s:/repo" -w /repo "%s" protect --staged --redact -v\n' "$REPO_DIR" "$GITLEAKS_IMAGE" > "$PRECOMMIT_HOOK"; chmod +x "$PRECOMMIT_HOOK"; PRECOMMIT_CREATED=1; fi; echo "AWS_ACCESS_KEY_ID=AKIAQWERTYUIOPASDFGH" > "$TEST_FILE"; git add "$TEST_FILE"; if git hook run pre-commit; then echo "FAIL: gitleaks did NOT block the test secret."; else echo "PASS: gitleaks blocked the test secret."; fi; git reset -- "$TEST_FILE" >/dev/null 2>&1; rm -f "$TEST_FILE"; [ "$PRECOMMIT_CREATED" = "1" ] && rm -f "$PRECOMMIT_HOOK"; }; githooks_selftest; unset -f githooks_selftest # gitleaks:allow
```

### PowerShell

```powershell
function Test-GitHooks { $repoRoot = git rev-parse --show-toplevel; Set-Location $repoRoot; $gitleaksImage = "zricethezav/gitleaks:v8.30.1"; $testFile = "githooks-selftest-secret.txt"; $precommitHook = ".githooks/pre-commit"; $precommitCreated = $false; if ((git config --get core.hooksPath) -ne '.githooks') { Write-Host "FAIL: core.hooksPath is not set to .githooks (run: git config core.hooksPath .githooks)"; return }; if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { Write-Host "FAIL: docker is not available"; return }; if (-not (Test-Path $precommitHook)) { $repoDir = git rev-parse --show-toplevel; "#!/bin/sh`nMSYS_NO_PATHCONV=1 docker run --rm -v `"$repoDir`:/repo`" -w /repo `"$gitleaksImage`" protect --staged --redact -v`n" | Set-Content -Path $precommitHook -NoNewline; $precommitCreated = $true }; "AWS_ACCESS_KEY_ID=AKIAQWERTYUIOPASDFGH" | Set-Content -Path $testFile -NoNewline; git add $testFile; git hook run pre-commit; if ($LASTEXITCODE -eq 0) { Write-Host "FAIL: gitleaks did NOT block the test secret." } else { Write-Host "PASS: gitleaks blocked the test secret." }; git reset -- $testFile | Out-Null; Remove-Item -Path $testFile -ErrorAction SilentlyContinue; if ($precommitCreated) { Remove-Item -Path $precommitHook -ErrorAction SilentlyContinue } }; Test-GitHooks; Remove-Item function:Test-GitHooks # gitleaks:allow
```


## Ignoring False Positives / Known Secrets

The secret scanner (gitleaks) sometimes flags values that aren't real
credentials - test fixtures, example keys in docs, hashes, etc. Both the
local hooks and the `secret-scan` CI workflow read the same config, so a fix
in one place applies everywhere. Use the most specific option that fits:

1. **One-off finding (recommended for a single false positive)**
   Add the exact `Fingerprint` gitleaks reports for that finding (e.g.
   `README.md:generic-api-key:475`) to a `.gitleaksignore` file at the repo
   root, one fingerprint per line.

2. **Inline, right next to the code**
   ```ts
   const placeholder = "sk_test_examplekeyfordocs"; // gitleaks:allow
   ```

3. **Project-wide pattern, path, or rotated-secret commit (recurring case)**
   There's no `.gitleaks.toml` in this repo by default - gitleaks works
   fine without one. If you need to allowlist something broader than a
   single finding (e.g. a whole fixtures folder, or a historical commit
   whose secret has since been rotated), create a `.gitleaks.toml` at the
   repo root - it's picked up automatically by both the local hooks and
   the `secret-scan` CI workflow, no extra flag needed:
   ```toml
   [extend]
   useDefault = true  # keep gitleaks' built-in rules, just add exceptions

   [allowlist]
   paths = [
     '''fixtures/.*''',
   ]
   regexes = [
     '''sk_test_examplekeyfordocs''',  # gitleaks:allow
   ]
   commits = [
     "0000000000000000000000000000000000000000",
   ]
   ```

Only use these to suppress confirmed false positives or already-rotated
secrets - never to silence a genuine, still-valid leak. If in doubt, rotate
the credential first, then allowlist it.
