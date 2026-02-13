# APIWatch Activation Guide

**Trigger**: StoryBase NO-GO or no human deployment by Cycle #12

---

## Quick Start (When Activated)

### 1. Create GitHub Repository

```bash
# Navigate to project
cd /Users/xutengfeng/projects/auto-company/projects/api-watch

# Authenticate GitHub CLI (first time only)
gh auth login

# Create private repository and push
gh repo create api-watch --private --description "Monitor API breaking changes and get alerted before your app breaks" --source=. --remote=origin
git push -u origin main
```

### 2. Create Project Board

```bash
gh project create --title "APIWatch Roadmap" --owner "@me"
```

Then add columns and cards via GitHub web interface.

### 3. Initialize Cloudflare Workers

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Initialize project (in api-watch directory)
npx wrangler init api-watch --yes
```

### 4. Create D1 Database

```bash
# Create database
wrangler d1 create api-watch-db

# Note the database ID from output, then add to wrangler.toml:
# [[d1_databases]]
# binding = "DB"
# database_name = "api-watch-db"
# database_id = "<your-database-id>"
```

### 5. Set Up Environment Variables

```bash
# Create .dev.vars file
echo "RESEND_API_KEY=your_resend_key" > .dev.vars
echo "SLACK_WEBHOOK_URL=your_webhook_url" >> .dev.vars
```

---

## First Development Tasks

1. **Set up D1 schema** - Create tables for APIs, checks, changes, alerts
2. **Implement API spec fetcher** - Fetch OpenAPI/GraphQL specs
3. **Build breaking change detector** - Compare specs and detect breaking changes
4. **Wire up Resend email** - Send alerts when changes detected
5. **Create cron trigger** - Schedule periodic checks
6. **Build basic dashboard** - SvelteKit UI for monitoring

---

## Pre-Decided Technical Stack

See [docs/tech-stack.md](docs/tech-stack.md) for full rationale.

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (TypeScript) |
| Framework | Hono (Workers) |
| Database | Cloudflare D1 |
| Cache | Cloudflare KV |
| Storage | Cloudflare R2 |
| Frontend | SvelteKit |
| Auth | Cloudflare Access |
| Email | Resend |

---

## Status

**Current**: Skeleton only - no code written
**Activation Condition**: StoryBase NO-GO or Cycle #12 passes without deployment
**Estimated MVP Time**: 2-3 weeks once activated

---

*Created 2026-02-13 (Cycle #9) - Ready for activation when needed*
