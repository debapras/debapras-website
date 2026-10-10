#!/usr/bin/env bash
# Read-only audit of debapras-website leftovers in the shared GCP project.
# Prints a Markdown table and writes $GITHUB_STEP_SUMMARY.
# Exits 1 when debapras-website is still deployed.
# Other project resources (BytePrep, RootLink, Cloud SQL) are listed and do not fail this job.
# Do not echo secrets.

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-rootlink-507715}"
REGION="${REGION:-asia-south1}"
SERVICE_NAME="${SERVICE_NAME:-debapras-website}"
AR_REPO="${AR_REPO:-debapras-website}"

ROWS="$(mktemp)"
ACTIVE_COUNT=0
LIST_ERRORS=0
trap 'rm -f "${ROWS}"' EXIT

gcloud config set project "${PROJECT_ID}" >/dev/null

gcloud_json() {
  local tmp err
  tmp="$(mktemp)"
  err="$(mktemp)"
  if gcloud "$@" --format=json >"${tmp}" 2>"${err}"; then
    if [ ! -s "${tmp}" ]; then
      echo "[]"
    else
      cat "${tmp}"
    fi
    rm -f "${tmp}" "${err}"
    return 0
  fi
  cat "${err}" >&2
  if grep -qiE 'is not enabled|has not been used|SERVICE_DISABLED' "${err}"; then
    echo "[]"
    rm -f "${tmp}" "${err}"
    return 0
  fi
  LIST_ERRORS=$((LIST_ERRORS + 1))
  echo "[]"
  rm -f "${tmp}" "${err}"
  return 0
}

jq_names() {
  jq -r '
    if type != "array" then [] else . end
    | .[]?
    | (.metadata.name // .name // empty)
    | split("/") | last
  '
}

row_cleared() {
  local type="$1"
  local name="$2"
  printf '| %s | `%s` | ✅ CLEARED | Free ($0.00) |\n' "${type}" "${name}" >>"${ROWS}"
}

row_active() {
  local type="$1"
  local name="$2"
  local cost="$3"
  ACTIVE_COUNT=$((ACTIVE_COUNT + 1))
  printf '| %s | `%s` | <span style="color:#d1242f"><strong>⚠️ ACTIVE</strong></span> | **%s** |\n' \
    "${type}" "${name}" "${cost}" >>"${ROWS}"
}

row_info() {
  local type="$1"
  local name="$2"
  local cost="$3"
  printf '| %s | `%s` | ℹ️ PRESENT | %s |\n' "${type}" "${name}" "${cost}" >>"${ROWS}"
}

run_json="$(gcloud_json run services list --project="${PROJECT_ID}")"
mapfile -t run_names < <(printf '%s' "${run_json}" | jq_names | sed '/^$/d' | sort -u)
site_run=0
for name in "${run_names[@]+"${run_names[@]}"}"; do
  [ -z "${name}" ] && continue
  if [ "${name}" = "${SERVICE_NAME}" ]; then
    site_run=1
    row_active "Cloud Run" "${name}" "debapras-website can still take requests"
  else
    row_info "Cloud Run" "${name}" "Other app in this project (not deleted by debapras-website teardown)"
  fi
done
if [ "${site_run}" -eq 0 ]; then
  row_cleared "Cloud Run" "${SERVICE_NAME}"
fi

ar_json="$(gcloud_json artifacts repositories list --project="${PROJECT_ID}")"
mapfile -t ar_names < <(printf '%s' "${ar_json}" | jq_names | sed '/^$/d' | sort -u)
site_ar=0
for name in "${ar_names[@]+"${ar_names[@]}"}"; do
  [ -z "${name}" ] && continue
  if [ "${name}" = "${AR_REPO}" ]; then
    site_ar=1
    row_info "Artifact Registry" "${name}" "debapras-website image storage (cents). Wipe deletes this repo."
  else
    row_info "Artifact Registry" "${name}" "Other repo (not deleted by debapras-website teardown)"
  fi
done
if [ "${site_ar}" -eq 0 ]; then
  row_cleared "Artifact Registry" "${AR_REPO}"
fi

sql_json="$(gcloud_json sql instances list --project="${PROJECT_ID}")"
mapfile -t sql_rows < <(printf '%s' "${sql_json}" | jq -r '
  if type != "array" then [] else . end
  | .[]?
  | [
      ((.name // "") | split("/") | last),
      (.state // "UNKNOWN"),
      (.settings.activationPolicy // "UNKNOWN")
    ] | @tsv
' | sed '/^$/d')
sql_found=0
for line in "${sql_rows[@]+"${sql_rows[@]}"}"; do
  [ -z "${line}" ] && continue
  sql_found=1
  name="$(printf '%s' "${line}" | cut -f1)"
  state="$(printf '%s' "${line}" | cut -f2)"
  policy="$(printf '%s' "${line}" | cut -f3)"
  row_info "Cloud SQL" "${name} (${state}, ${policy})" "Not a debapras-website resource."
done
if [ "${sql_found}" -eq 0 ]; then
  row_cleared "Cloud SQL" "(none in this project)"
fi

TABLE="$(
  cat <<EOF
| Resource Type | Resource Name | Status | Cost Impact |
|---|---|---|---|
$(cat "${ROWS}")
EOF
)"

if [ "${LIST_ERRORS}" -gt 0 ]; then
  RESULT="**FAIL** — ${LIST_ERRORS} GCP list call(s) failed (permission or API error). Cannot prove cleanup."
  EXIT_CODE=1
elif [ "${ACTIVE_COUNT}" -gt 0 ]; then
  RESULT="**FAIL** — \`${SERVICE_NAME}\` is still deployed. Teardown \`stop\` keeps it (this audit is expected to fail). To remove it, run **Teardown GCP** with \`wipe\` and confirm \`DELETE\`, then re-run this audit."
  EXIT_CODE=1
else
  RESULT="**PASS** — \`${SERVICE_NAME}\` is gone. Artifact Registry and other project rows are informational."
  EXIT_CODE=0
fi

REPORT="$(
  cat <<EOF
# debapras-website GCP cleanup audit

Project \`${PROJECT_ID}\` · region \`${REGION}\` · $(date -u +"%Y-%m-%dT%H:%M:%SZ")

${TABLE}

## Result

${RESULT}

This audit only fails when the debapras-website Cloud Run service is still there, or when a list call errors. It does not delete anything.
EOF
)"

printf '%s\n' "${REPORT}"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  printf '%s\n' "${REPORT}" >>"${GITHUB_STEP_SUMMARY}"
fi

exit "${EXIT_CODE}"
