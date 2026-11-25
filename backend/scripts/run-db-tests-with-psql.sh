#!/usr/bin/env bash
# Runs the pgTAP files in supabase/tests/database with psql, for when `supabase test db`
# cannot pull its pg_prove image. Each test file wraps itself in begin/rollback.
set -euo pipefail
cd "$(dirname "$0")/.."
db_url="$(supabase status -o json 2>/dev/null | python3 -I -c 'import json,sys; print(json.load(sys.stdin)["DB_URL"])')"
failed=0
for file in supabase/tests/database/*.test.sql; do
  output="$(psql "$db_url" -q -t -A -v ON_ERROR_STOP=1 -f "$file" 2>&1)" || failed=1
  plan="$(grep -m1 -E '^1\.\.[0-9]+' <<<"$output" || true)"
  passed="$(grep -cE '^ok ' <<<"$output" || true)"
  echo "$file: $passed/${plan#1..} ok"
  if grep -qE '^not ok|ERROR' <<<"$output" || [ "$passed" != "${plan#1..}" ]; then
    failed=1
    grep -E '^not ok|^#|ERROR' <<<"$output" || true
  fi
done
exit "$failed"
