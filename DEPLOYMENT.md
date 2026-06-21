# DEPLOYMENT (Cloudflare-first)

## Prerequisites
- Node.js 20+
- Wrangler authenticated (`wrangler login`)
- Cloudflare resources: KV, D1, R2 (IDs set in `wrangler.toml`)

## Environment setup
Set production secrets with Wrangler:
```bash
wrangler secret put AUTH_BYPASS_TOKEN --env production
wrangler secret put APPROVAL_BYPASS_CODE --env production
```

Optional integration placeholders (future):
- Canvas OAuth credentials
- Google Classroom OAuth credentials

## Build and deploy
```bash
npm run build
npm run deploy
```

## Production observability
- Use Cloudflare Workers logs (`wrangler tail`)
- Forward structured audit events from `src/security/audit.ts`
- Attach Logpush or Analytics Engine for long-term retention

## Rate limiting baseline
- App vars: `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS`
- Cloudflare controls: WAF rules + Bot management + per-route limits

## Rollback
- Redeploy previous known-good commit with Wrangler
- Revert broken secrets/config using environment-specific values
