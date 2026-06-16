# 5. Send booking email from your domain (Resend)

Until this is done, the booking form works but sends from Resend's shared
`onboarding@resend.dev`. This step lets it send from
`bookings@eddiebarretta.com`. Do it **after** the domain points at your DNS
(step 4), since you'll be adding DNS records.

## Steps

- [ ] **Resend → Domains** → add `eddiebarretta.com`.
- [ ] Resend gives you **DKIM** (and SPF / return-path) records. Add them in your
      DNS (Cloudflare, or wherever the domain resolves after step 3).
- [ ] Wait for Resend to show the domain as **Verified**.
- [ ] In Vercel, set
      `CONTACT_FROM_EMAIL="Eddie Barretta <bookings@eddiebarretta.com>"` and
      **redeploy**.
- [ ] *(Optional)* Set up forwarding for `bookings@eddiebarretta.com` so replies
      to inquiries reach your normal inbox.

## Verify

- [ ] Submit the booking form on the live site.
- [ ] Confirm the email arrives **and** the From address is your domain.
- [ ] Check it isn't flagged as spam — proper DKIM/SPF is what prevents that.

## Then decommission

- [ ] Once the live domain, the booking form, and domain email all work,
      **cancel the Bandzoogle plan**.
