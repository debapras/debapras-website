# Shared helper for the debapras-website GitHub Actions deploy.
# Tar + GCS upload avoids gcloud walking the checkout (same approach as In-shorts).

cloud_build_submit_wait() {
  local context="$1"
  local config="$2"
  local tag="$3"
  local id=""
  local status=""
  local i
  local bucket="${PROJECT_ID}_cloudbuild"
  local slug
  local object
  local tmpdir
  local tmp

  export CLOUDSDK_CORE_DISABLE_FILE_LOGGING=true
  rm -rf "${HOME}/.config/gcloud/logs" || true

  slug="$(basename "${config}" .yaml)"
  object="github/${GITHUB_SHA:-manual}/${slug}.tgz"
  tmpdir="$(mktemp -d)"
  tmp="${tmpdir}/source.tgz"

  echo "Archiving ${context} to gs://${bucket}/${object}"
  tar -C "${context}" \
    --exclude-vcs \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='coverage' \
    -czf "${tmp}" .

  gcloud storage cp "${tmp}" "gs://${bucket}/${object}" --quiet
  rm -rf "${tmpdir}"

  id="$(gcloud builds submit "gs://${bucket}/${object}" \
    --config "${config}" \
    --substitutions="_TAG=${tag},_REGION=${REGION},_AR_REPO=${AR_REPO}" \
    --async \
    --quiet \
    --region=global \
    --format='value(id)')"

  if [ -z "${id}" ]; then
    echo "Cloud Build did not return an id" >&2
    return 1
  fi
  echo "Cloud Build submitted id=${id}"

  for i in $(seq 1 80); do
    status="$(gcloud builds describe "${id}" --region=global --quiet --format='value(status)')"
    echo "Cloud Build ${id} status=${status}"
    case "${status}" in
      SUCCESS)
        return 0
        ;;
      FAILURE|TIMEOUT|CANCELLED|EXPIRED|INTERNAL_ERROR)
        echo "Cloud Build ${id} failed status=${status}" >&2
        gcloud builds describe "${id}" --region=global --quiet \
          --format='yaml(status,statusDetail,failureInfo)' >&2 || true
        echo "Open Cloud Build logs in the GCP console for id ${id}" >&2
        return 1
        ;;
    esac
    sleep 15
  done

  echo "Cloud Build ${id} timed out waiting for SUCCESS" >&2
  return 1
}
