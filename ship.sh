#!/usr/bin/env bash
# Ship one slice: checks → commit → push → PR → wait for CI → merge → tag.
# Usage: ./ship.sh <branch> "<conventional commit message>" [tag] [paths...]
#   paths default to: src server shared prisma docs *.md
set -euo pipefail

branch="$1"; msg="$2"; tag="${3:-}"; shift $(( $# >= 3 ? 3 : $# ))
paths=("$@"); [ ${#paths[@]} -eq 0 ] && paths=(src server shared prisma docs ./*.md)

npm run -s typecheck
npm run -s lint
npm test --silent

current="$(git branch --show-current)"
[ "$current" = "$branch" ] || git switch -c "$branch" 2>/dev/null || git switch "$branch"

for p in "${paths[@]}"; do if [ -e "$p" ]; then git add -- "$p"; fi; done
git commit -m "$msg

Co-Authored-By: Claude <noreply@anthropic.com>"
git push -u origin "$branch"
gh pr create --title "$msg" --body "$msg

🤖 Generated with [Claude Code](https://claude.com/claude-code)" >/dev/null
sleep 5
gh pr checks --watch --interval 10
gh pr merge --merge --delete-branch
git switch main && git pull -q
if [ -n "$tag" ]; then git tag "$tag" && git push -q origin "$tag"; fi
echo "shipped: $msg ${tag:+($tag)}"
