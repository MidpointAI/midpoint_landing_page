#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: $0 <owner/repo> <repo-skill-path> [install-name]" >&2
  exit 1
fi

repo="$1"
skill_path="$2"
skill_name="${3:-$(basename "$skill_path")}"

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
codex_home="${CODEX_HOME:-$HOME/.codex}"
installer="$codex_home/skills/.system/skill-installer/scripts/install-skill-from-github.py"
dest_dir="$root_dir/.agents/skills"

if [[ ! -f "$installer" ]]; then
  echo "Installer not found at $installer" >&2
  exit 1
fi

python3 "$installer" \
  --repo "$repo" \
  --path "$skill_path" \
  --name "$skill_name" \
  --dest "$dest_dir" \
  --method auto

echo "Installed $skill_name into $dest_dir/$skill_name"
echo "Update skills-lock.json if you need the manifest to reflect the new skill."
