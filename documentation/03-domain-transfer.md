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

**Cloudflare Registrar** — recommended (at-cost pricing, and you manage DNS there):
- [ ] Add the domain in Cloudflare and choose **Transfer**.
- [ ] Paste the auth code and start the transfer.

**Vercel Domains** — simplest (DNS becomes automatic, no records to set in step 4):
- [ ] Transfer the domain inside the Vercel dashboard and paste the auth code.

Then, either way:
- [ ] Approve the confirmation email.
- [ ] Wait — transfers take up to **~5 days** and add **+1 year** of registration.

> Cleanest order is transfer first, then the DNS cutover (step 4). The old site
> keeps serving throughout, so there's no rush and no downtime.
