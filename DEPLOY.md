# APIWatch Deployment Guide

**Status**: Ready for deployment - Requires Cloudflare email verification

---

## 🚀 Quick Deploy (2 minutes)

### Prerequisite: Verify Cloudflare Account

Before deploying, you must verify your Cloudflare account email:

1. Go to https://dash.cloudflare.com/profile
2. Verify your email address
3. Wait for confirmation email

### Step 1: Install Dependencies

```bash
cd /Users/xutengfeng/projects/auto-company/projects/api-watch/api-watch-worker
npm install
```

### Step 2: Deploy to Cloudflare Pages

```bash
# Create Pages project
npx wrangler pages project create api-watch --production-branch=main

# Deploy
npm run build
npx wrangler pages deploy .svelte-kit/output --project-name=api-watch
```

### Step 3: Configure Environment

After deployment, set up these environment variables in Cloudflare dashboard:

| Variable | Value | Purpose |
|----------|--------|---------|
| `ENVIRONMENT` | `production` | Runtime environment |
| `RESEND_API_KEY` | Your Resend key | Email alerts |
| `SLACK_WEBHOOK_URL` | Optional | Slack alerts |

---

## 📊 What's Deployed

### Landing Page Features
- ✅ Hero section with email signup
- ✅ Problem/solution explanation
- ✅ Feature grid (6 features)
- ✅ Pricing table (Free, Starter, Pro)
- ✅ Responsive design (mobile + desktop)
- ✅ Custom CSS (no framework bloat)

### Database Schema (D1)
- `users` - User accounts and plans
- `monitors` - API monitoring configurations
- `check_results` - Each API check result
- `changes` - Individual breaking changes detected
- `alert_channels` - Email/Slack/webhook configs
- `alerts` - Alert delivery tracking
- `sessions` - Authentication sessions
- `template_apis` - Pre-configured API templates

### Infrastructure (Cloudflare)
| Resource | Name | ID | Status |
|-----------|-------|-----|--------|
| D1 Database | `api-watch-db` | `7413b9f6-...` | ✅ Created |
| KV Namespace | `CACHE` | `fbb1e03f...` | ✅ Created |
| Pages Project | `api-watch` | Pending | ⏳ Needs verification |

---

## 🔧 Development

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Next Development Priorities

### Phase 1: Core Detection Engine (Week 1)
1. **OpenAPI fetcher** - Fetch specs from URLs
2. **Diff engine** - Compare specs using `oasdiff`
3. **Cron triggers** - Schedule periodic checks
4. **Email alerts** - Wire up Resend

### Phase 2: User Onboarding (Week 2)
1. **Magic link auth** - Email-based login
2. **Monitor creation** - Add API to monitor
3. **Dashboard** - View monitor status
4. **Alert history** - See past changes

### Phase 3: Launch (Week 3-4)
1. **Testing** - QA sign-off
2. **Documentation** - User guides
3. **Marketing** - Reddit/HN posts
4. **Product Hunt** - Launch day

---

## 🎯 Success Metrics (Week 1)

| Metric | Target | Current |
|--------|--------|---------|
| Landing Page Live | ✅ | ✅ |
| Email Capture Working | 📧 | ⏳ Pending auth |
| First Sign Up | 1 | 0 |
| First API Monitored | 1 | 0 |
| First Alert Sent | 1 | 0 |

---

## 🔗 Links

- **GitHub**: https://github.com/pageprincess/api-watch
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/

---

**Last Updated**: Cycle #12 (2026-02-13)
**Next Action**: Deploy after email verification → Implement breaking change detection engine
