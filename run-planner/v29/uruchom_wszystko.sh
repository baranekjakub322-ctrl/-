#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "$0")"
exec node testy/run_v29.mjs
