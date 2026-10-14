# Setting up the custom domain

How `debaprasad.com` reaches the portfolio running on Cloud Run.

```text
Browser ──► debaprasad.com (GoDaddy DNS)
              │
              ▼
        Firebase Hosting  (free SSL, global CDN)
              │  rewrite "**"
              ▼
        Cloud Run: debapras-website  (asia-south1)
```

## Why Firebase Hosting

Cloud Run's built-in domain mapping is not available in `asia-south1` (Mumbai) and is
still a Preview feature. Google lists three ways to put a custom domain in front of
Cloud Run:

| Option | Extra cost | Notes |
| --- | --- | --- |
| Firebase Hosting rewrite | Free at portfolio traffic | Used here |
| Global external Application Load Balancer | About $18/month plus data | Overkill for a portfolio |
| Cloud Run domain mapping | Free | Not available in `asia-south1`, Preview only |

Firebase Hosting's no-cost allowance is 10 GB storage and 360 MB/day transfer. Cloud Run
billing does not change: you still pay per request, and nothing while it is scaled to zero.

## Project facts

| Item | Value |
| --- | --- |
| GCP / Firebase project | `rootlink-507715` |
| Cloud Run service | `debapras-website` |
| Region | `asia-south1` |
| Firebase default URL | <https://rootlink-507715.web.app> |
| Domain registrar | GoDaddy |
| Primary domain | `debaprasad.com` |
| Secondary domain | `www.debaprasad.com` (redirects to the primary) |

## Files

- `deploy/firebase/firebase.json`: sends every request (`**`) to the Cloud Run service.
- `deploy/firebase/public/`: intentionally empty. Firebase Hosting requires a public
  folder; any file placed here would be served instead of the Cloud Run response.

## Part 1: Firebase Hosting (done)

1. Install the Firebase CLI and sign in with the account that owns the GCP project:

   ```powershell
   npm install -g firebase-tools
   firebase login
   ```

2. Add Firebase to the existing GCP project from the
   [Firebase console](https://console.firebase.google.com/): **Create a project**, then
   **Add Firebase to a Google Cloud project**, pick `rootlink-507715`, accept the terms,
   and confirm the pay-as-you-go plan. Google Analytics is not needed.

   `firebase projects:addfirebase rootlink-507715` fails with `403 PERMISSION_DENIED`
   until the Firebase Terms of Service have been accepted once in the console.

3. Deploy the Hosting config:

   ```powershell
   cd "D:\My Project\Personal-website\deploy\firebase"
   firebase deploy --only hosting --project rootlink-507715
   ```

4. Open <https://rootlink-507715.web.app> and confirm the portfolio loads.

## Part 2: Connect the domain in Firebase

1. Firebase console, project `rootlink-507715`, **Build**, **Hosting**.
2. Click **Add custom domain**.
3. Enter `debaprasad.com`. Leave "Redirect to an existing website" unticked. Continue.
4. Firebase shows the DNS records to add. Keep this page open. Usually:
   - one **TXT** record on `@` (proves you own the domain)
   - one or more **A** records on `@` (route traffic to Firebase)
5. Click **Add custom domain** again and enter `www.debaprasad.com`.
   Tick **Redirect to an existing website** and choose `debaprasad.com`.
   Firebase shows the record for `www` (an **A** or **CNAME** record on `www`).

Always copy the values from the Firebase screen. Do not reuse IP addresses from a guide.

## Part 3: Add the DNS records in GoDaddy

1. GoDaddy, **My Products**, `debaprasad.com`, **DNS** (Manage DNS).
2. **Remove the conflicts first:**
   - Delete every **A** record on `@` that points to GoDaddy's holding page. It shows as
     `Parked` in the table, and resolves to `76.223.105.230` and `13.248.243.5`. Both IPs
     must go.
   - If **Forwarding** is set for the domain, remove it.
   - Delete the **CNAME** on `www` that points to `@` (or `debaprasad.com`) if Firebase
     asked for a different `www` record.
3. **Add each record exactly as Firebase shows it:**

   | Type | Name | Value | TTL |
   | --- | --- | --- | --- |
   | TXT | `@` | the `hosting-site=...` string from Firebase | 1 hour |
   | A | `@` | the IP address from Firebase | 1 hour |
   | A or CNAME | `www` | the value Firebase gave for `www` | 1 hour |

   Values Firebase issued for this project (October 2026):

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `199.36.158.100` |
   | TXT | `@` | `hosting-site=rootlink-507715` |
   | CNAME | `www` | `rootlink-507715.web.app` |

   In GoDaddy's **Name** field, enter only `www` or `@`. GoDaddy appends the domain itself.

   If Firebase lists more than one A record for `@`, add each one as a separate record.
4. Leave the **NS** and **SOA** records alone.
5. If a **CAA** record exists, it must allow `letsencrypt.org` and `pki.goog`, or the SSL
   certificate cannot be issued. With no CAA record at all, nothing needs to change.
6. Save.

## Part 4: Verify and wait for SSL

1. Back in Firebase Hosting, click **Verify** on each domain.
2. Status moves through **Needs setup**, **Pending**, then **Connected**. DNS changes
   usually take minutes, sometimes a few hours.
3. Firebase then issues a free SSL certificate. This usually takes under an hour and can
   take up to 24 hours. Until it is issued, the browser may show a certificate warning.

Check DNS from PowerShell while you wait:

```powershell
Resolve-DnsName debaprasad.com -Type A
Resolve-DnsName debaprasad.com -Type TXT
Resolve-DnsName www.debaprasad.com
```

The A record should show only the Firebase IP. If `76.223.105.230` or `13.248.243.5`
still appears, a parked record or Forwarding is still active in GoDaddy, or the old
1-hour TTL has not expired yet.

## Part 5: Final checks

```powershell
curl.exe -sI https://debaprasad.com/
curl.exe -sI https://www.debaprasad.com/
```

- `https://debaprasad.com/` returns `200`.
- `https://www.debaprasad.com/` returns `301` with `Location: https://debaprasad.com/`.
- `http://debaprasad.com/` redirects to `https://`.

Also open the site in a browser in both light and dark mode, and confirm the resume,
contact popovers, and tech-stack links work.

## Deploying after this

- **Website changes:** keep using the existing **Deploy to GCP** GitHub workflow. Firebase
  forwards to the latest Cloud Run revision, so no Firebase step is needed.
  HTML responses are sent with `Cache-Control: private, no-store`, so the Firebase CDN does
  not hold stale pages after a deploy.
- **Only when `firebase.json` changes:** redeploy Hosting:

  ```powershell
  cd "D:\My Project\Personal-website\deploy\firebase"
  firebase deploy --only hosting --project rootlink-507715
  ```

- **Renaming the Cloud Run service or changing its region:** update `serviceId` or
  `region` in `firebase.json` and redeploy Hosting, or the domain will return errors.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `403 PERMISSION_DENIED` on `projects:addfirebase` | Firebase terms not accepted | Add Firebase from the console (Part 1, step 2) |
| Domain stuck on **Needs setup** | Records missing or the parked A record still exists | Recheck Part 3, then `Resolve-DnsName` |
| Certificate warning for hours | DNS not fully propagated, or CAA blocks issuance | Wait up to 24 hours; allow `letsencrypt.org` and `pki.goog` in CAA |
| GoDaddy page still shows | Parked A record or Forwarding still active | Delete both, wait for the TTL to expire |
| Firebase "Site Not Found" page | Hosting not deployed for this project | Run the Hosting deploy command |
| `404` or `503` from the domain | Cloud Run service missing, stopped, or in a different region | Check `debapras-website` in `asia-south1`, then `firebase.json` |
| Requests over 60 seconds fail with `504` | Firebase Hosting request timeout | Keep responses under 60 seconds |

## Cost guardrail

Set a budget alert in the GCP console under **Billing**, **Budgets & alerts** (for
example ₹500/month with alerts at 50%, 90%, and 100%), so any unexpected usage is
flagged early.
