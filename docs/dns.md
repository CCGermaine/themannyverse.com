# DNS & Domain

## Current state (checked 2026-10-12)

- https://themannyverse.com returns **200** over HTTPS. GitHub Pages provisions the certificate.
- `www.themannyverse.com` returns **301** to `https://themannyverse.com/`.
- Registrar and nameservers: Porkbun (`curitiba`, `fortaleza`, `maceio`, `salvador.ns.porkbun.com`). No nameserver change was needed.

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | themannyverse.com | 185.199.108.153 | 600 |
| A | themannyverse.com | 185.199.109.153 | 600 |
| A | themannyverse.com | 185.199.110.153 | 600 |
| A | themannyverse.com | 185.199.111.153 | 600 |
| CNAME | *.themannyverse.com | ccgermaine.github.io/themannyverse.com | 600 |
| MX | themannyverse.com | fwd1.porkbun.com (prio: 10) | 600 |
| MX | themannyverse.com | fwd2.porkbun.com (prio: 20) | 600 |
| TXT | themannyverse.com | v=spf1 include:_spf.porkbun.com ~all | 600 |

## History

- **2026-09-26**: Porkbun's ALIAS record did not resolve through public resolvers (8.8.8.8, 1.1.1.1). It was replaced with the four GitHub Pages A records. The Vite base path was fixed to `/`.
- **2026-10-05**: GitHub issued the certificate; HTTPS on.
- **2026-10-12**: the redesign launched. `www` confirmed redirecting to the apex.

## Notes

- Porkbun also issued a free SSL certificate. It is not used; GitHub Pages serves its own.
- With a registrar's ALIAS/ANAME records for GitHub Pages, prefer standard A records. ALIAS is a proprietary extension and did not resolve through recursive resolvers here.
