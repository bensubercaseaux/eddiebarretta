# 4. Point the domain at Vercel (DNS cutover)

This is the moment the site flips from Bandzoogle to Vercel. Do it once the
domain is under your control; propagation is usually minutes.

## Steps

- [ ] Vercel → Project → **Domains** → add **`eddiebarretta.com`** and
      **`www.eddiebarretta.com`**.
- [ ] Vercel shows the exact records to create. Set them where your DNS lives:

### If DNS is on Cloudflare

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `@` | `76.76.21.21` | **DNS only (grey cloud)** |
| CNAME | `www` | `cname.vercel-dns.com` | **DNS only (grey cloud)** |

> Proxied (orange cloud) breaks Vercel's SSL issuance — keep both **grey**.
> Always use the values Vercel displays if they differ from the above.

### If you used Vercel Domains

Nothing to do — Vercel wires the records automatically.

- [ ] Wait for Vercel to mark the domain **Valid** and issue the SSL certificate.
- [ ] Visit `https://eddiebarretta.com` — it now serves from Vercel.
- [ ] Confirm `www` redirects to the apex (Vercel's default canonical behaviour).

## After cutover

- [ ] Re-test the booking form on the **real** domain.
- [ ] In [Google Search Console](https://search.google.com/search-console),
      verify the domain and submit `https://eddiebarretta.com/sitemap.xml`.
