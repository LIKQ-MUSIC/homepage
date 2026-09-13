# Homepage deployment

Vercel's Git integration builds pushes. `develop` serves
https://dev.likqmusic.com; `master` serves https://www.likqmusic.com.
Feature branches have their own preview URLs and must be merged into `develop`
before their changes can appear on the dev domain. Local edits must be committed
and pushed first.

Every push to `develop` also runs **Verify dev deployment** in GitHub Actions.
This does not start a second build. It waits for the Vercel deployment matching
that exact commit, checks the dev alias, and reads `X-LIKQ-Commit` from the actual
homepage response. A green Vercel build alone is not the completion criterion;
the verification job must also pass.

If the alias is stale for 45 seconds after the build is ready, the verifier
assigns it to that deployment using the Vercel API with an explicit team ID.
It refuses to operate on production or a different project, and checks the
current GitHub `develop` HEAD before writing. New pushes cancel earlier runs.
An incorrect domain-to-branch mapping, failed build, API authentication error,
or stale homepage fails the job instead of silently reporting success.

The workflow uses the existing `VERCEL_TOKEN` repository secret and the built-in
read-only `GITHUB_TOKEN`. Project and team IDs are pinned in the script so a
wrong repository secret cannot redirect this job to another project.

To inspect what dev currently serves:

```sh
git ls-remote origin refs/heads/develop
curl -sSI https://dev.likqmusic.com/ | rg -i 'x-likq-commit'
```

These commit hashes must match. If verification fails, inspect the Actions log
and linked Vercel deployment. Fix the reported cause, then rerun the failed job
for the latest develop commit. Do not force an older preview onto the dev alias.

Test the verification logic with:

```sh
node --test scripts/verify-dev-deployment.test.mjs
```
