# APIWatch Deployment Checklist

## Pre-Deployment Verification

- [ ] **Cloudflare Email Verified**
  - Visit: https://dash.cloudflare.com/profile
  - Check for verification email
  - Click verification link

## Deployment Steps (2 minutes)

```bash
cd /Users/xutengfeng/projects/auto-company/projects/api-watch/api-watch-worker

# 1. Build (already done)
npm run build

# 2. Create Pages project
npx wrangler pages project create api-watch --production-branch=main

# 3. Deploy
npx wrangler pages deploy .svelte-kit/output --project-name=api-watch
```

## Post-Deployment Testing (5 minutes)

### 1. Landing Page
```bash
curl -I https://api-watch.pages.dev
# Expected: 200 OK
```

### 2. API Templates
```bash
curl https://api-watch.pages.dev/api/templates
# Expected: JSON with 10 API templates
```

### 3. Add Monitoring
```bash
curl -X POST https://api-watch.pages.dev/api/monitored \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test API",
    "spec_url": "https://petstore.swagger.io/v2/swagger.json",
    "check_interval": 60
  }'
# Expected: Success response
```

### 4. List Monitored APIs
```bash
curl https://api-watch.pages.dev/api/monitored
# Expected: List with Test API
```

## Success Criteria

- [ ] Landing page loads
- [ ] `/api/templates` returns 10 templates
- [ ] Can add monitored API
- [ ] Can list monitored APIs
- [ ] Cron endpoint accessible (may need Workers deployment)

## Troubleshooting

**Email verification error**:
```
ERROR: Your user email must been verified [code: 8000077]
```
→ Check Cloudflare dashboard for verification email

**Project already exists**:
```
ERROR: Project already exists
```
→ Skip `project create` step, deploy directly

**Build fails**:
```bash
rm -rf node_modules .svelte-kit
npm install
npm run build
```

---

**Status**: ⏳ Awaiting Cloudflare email verification
**Next**: Deploy → Test → Launch 🚀
