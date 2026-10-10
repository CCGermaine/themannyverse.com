# DNS & Domain Progress

## Later check (2026-10-07)

https://themannyverse.com returned **200** over HTTPS. The certificate GitHub was still provisioning on 2026-09-26 is in place. The four apex A records still answer `185.199.108.153` through `185.199.111.153`, TTL 600. MX and the SPF TXT match the log below. Nameservers are still Porkbun.

`www.themannyverse.com` and the wildcard are published as CNAMEs to `ccgermaine.github.io/themannyverse.com`. That target is not a hostname, so neither name resolves to an address. The apex is the URL that works. The 2026-09-26 log below is the troubleshooting record. It lists the wildcard and omits `www`, which is published now with the same target.

## Current Status (as of 2026-09-26 12:30 UTC)

### Root Cause Identified
- The **ALIAS** record at Porkbun was not resolving via standard DNS resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1 returned no answers)
- ALIAS is a **proprietary extension**, not a standard DNS record type
- Standard DNS resolvers do not resolve ALIAS records from non-authoritative servers

### Fix Applied
- Replaced the ALIAS record with **four A records** pointing to GitHub Pages servers:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Kept the CNAME for `*.themannyverse.com` (wildcard subdomain)
- Kept MX, TXT, and SPF records unchanged

### DNS Resolution Status
- **`themannyverse.com` → `185.199.108.153`** ✅ (verified via system resolver)
- **HTTP 200 OK** from GitHub.com ✅
- **HTTPS**: Pending — GitHub reports "certificate does not exist yet" ⏳
- GitHub will auto-provision SSL certificate and enable HTTPS once verified

### Final DNS Record List

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
| TXT | _acme-challenge.themannyverse.com | ... | 600 | (×2) |

### Next Steps
1. ✅ DNS propagation complete (A records resolving)
2. ✅ Vite base path fixed (was `/themannyverse.com/`, changed to `/`)
3. ✅ On 2026-09-26 the site served the hero over HTTP. The live page is now the index in [Site Sections](site-sections.md)
4. ✅ GitHub provisioned the SSL certificate
5. ✅ HTTPS is on. https://themannyverse.com returned 200 on 2026-10-05

## Notes

### Nameservers NOT changed
The domain's nameservers remained pointing to Porkbun's (`curitiba`, `fortaleza`, `maceio`, `salvador.ns.porkbun.com`). No nameserver change was needed — only direct DNS record edits.

### SSL Certificate from Porkbun
A free SSL certificate was issued by Porkbun for `themannyverse.com`. This is **not used** — GitHub Pages provisions its own certificate. The Porkbun cert is redundant.

### Key Learning
When using a registrar's ALIAS/ANAME records for services like GitHub Pages, prefer **standard A records** instead. ALIAS records are convenient but don't resolve via standard recursive DNS servers (Google, Cloudflare), causing propagation delays and resolution failures.
