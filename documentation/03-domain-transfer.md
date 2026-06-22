# 3. Transfer the domain off Bandzoogle

`eddiebarretta.com` is registered through **Bandzoogle** (registrar **eNom**,
nameservers `*.sitezoogle.com`). It's past the 60-day new-registration lock, so
it can move. **The live site stays up for the entire transfer.**

## A. Release it from Bandzoogle

- [ ] Bandzoogle dashboard → domain settings:
  - [ ] **Unlock** the domain (remove the registrar / transfer lock).
  - [ ] **Turn off WHOIS privacy** — transfers often fail while it's on.
  - [ ] Request the **EPP / authorization (auth) code**.
- [ ] Confirm the domain's **admin email** is one you can receive mail at — the
      transfer approval email goes there.

## B. Bring it into a registrar you control

Pick one:

**Cloudflare Registrar** — at-cost pricing, you manage DNS there. The catch that
trips everyone up: **Cloudflare won't accept the auth/EPP code until the domain
is added to Cloudflare AND "Active" on Cloudflare's nameservers.** There is no
EPP box before that. Order:
- [ ] Cloudflare dashboard → **Add a domain** → `eddiebarretta.com` (Free plan is fine). Cloudflare scans and imports the existing DNS records.
- [ ] **Check the imported records** — the domain is about to leave Bandzoogle's nameservers, so whatever keeps the site live must exist in Cloudflare. If Vercel is ready, add the Vercel records now (see [04-vercel-domain-and-dns.md](04-vercel-domain-and-dns.md)); if not, keep the records that point at Bandzoogle so the current site stays up.
- [ ] At **Bandzoogle / eNom**, change the nameservers from `*.sitezoogle.com` to the two Cloudflare nameservers Cloudflare gives you. ⚠️ This is the moment DNS control moves to Cloudflare — on this path the registrar transfer and the DNS cutover (step 4) happen together, not separately.
- [ ] Wait until Cloudflare marks the domain **Active** (minutes to a few hours).
- [ ] **Now** the EPP box appears: domain → **Domain Registration → Transfer Domains** → select `eddiebarretta.com` → paste the **EPP/auth code** exactly (no stray spaces) → confirm contacts → pay the 1-year transfer fee.

**Vercel Domains** — simplest (DNS becomes automatic, no records to set in step 4):
- [ ] Transfer the domain inside the Vercel dashboard and paste the auth code.

Then, either way:
- [ ] Approve the confirmation email.
- [ ] Wait — transfers take up to **~5 days** and add **+1 year** of registration.

> Cleanest order is transfer first, then the DNS cutover (step 4). The old site
> keeps serving throughout, so there's no rush and no downtime.
