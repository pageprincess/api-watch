# APIWatch Deployment Guide

This guide walks you through deploying APIWatch to Cloudflare Pages with Workers, D1 Database, and KV storage.

## Prerequisites

- Node.js 18+ installed
- A Cloudflare account ([free tier works](https://dash.cloudflare.com/sign-up))
- `wrangler` CLI installed: `npm install -g wrangler`

## Step 1: Authenticate with Cloudflare

```bash
npx wrangler login
```

This will open your browser for OAuth authentication.

## Step 2: Create D1 Database

```bash
npx wrangler d1 create api-watch-db
```

Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "api-watch-db"
database_id = "<YOUR_DATABASE_ID>"
```

## Step 3: Create KV Namespace

```bash
npx wrangler kv namespace create API_WATCH_CACHE
```

Copy the `id` from the output and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "<YOUR_KV_NAMESPACE_ID>"
```

## Step 4: Set Up Environment Variables

For production deployments, create a `.dev.vars` file (not committed to git):

```bash
# .dev.vars
ENVIRONMENT=production
```

## Step 5: Initialize Database Schema

```bash
npx wrangler d1 execute api-watch-db --file=schema.sql
```

## Step 6: Build the Application

```bash
npm install
npm run build
```

This creates the production build in `.svelte-kit/output/`.

## Step 7: Deploy to Cloudflare Pages

### Option A: Direct Deployment (Quick Start)

```bash
npx wrangler pages deploy .svelte-kit/output --project-name=api-watch
```

### Option B: Connected Git Repository (Recommended for Updates)

1. Go to [Cloudflare Dashboard > Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.svelte-kit/output`
   - **Node.js version**: `18` (or latest)

## Step 8: Configure Cron Triggers

After deployment, set up the hourly monitoring schedule:

```bash
npx wrangler cron put "0 * * * *" --name="hourly-api-check"
```

This triggers the check endpoint every hour.

## Verification

After deployment, verify:

1. **Site loads**: Visit your Pages URL
2. **API works**: Test `/api/templates` endpoint
3. **Cron configured**: Check Workers dashboard for scheduled tasks
4. **Database connected**: Add a monitored API via `/api/monitored`

## Troubleshooting

### Build Fails

- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `rm -rf .svelte-kit node_modules && npm install`

### Database Errors

- Verify database_id in `wrangler.toml` matches your D1 database
- Check schema was applied: `npx wrangler d1 info api-watch-db`

### KV Not Working

- Verify KV namespace ID is correct
- Check binding name matches: `CACHE`

## Local Development

To test locally with Wrangler:

```bash
npx wrangler pages dev .svelte-kit/output --local --binding=DB=<local-db-path>
```

Or use the standard SvelteKit dev server:

```bash
npm run dev
```

Note: The dev server won't have D1/KV bindings. Use Wrangler for full integration testing.

## Production Checklist

Before going live:

- [ ] Email verified in Cloudflare account
- [ ] D1 database created and schema applied
- [ ] KV namespace created
- [ ] `wrangler.toml` updated with correct IDs
- [ ] Build runs without errors
- [ ] Deployment successful
- [ ] Custom domain configured (optional)
- [ ] Cron triggers active
- [ ] Email/Slack webhooks configured for alerts

## Next Steps

1. Add your first API to monitor via the landing page
2. Configure alert channels (email/Slack)
3. Check back in an hour to see first scan results
4. Set up monitoring dashboards

## Support

- **Issues**: [GitHub Issues](https://github.com/pageprincess/api-watch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pageprincess/api-watch/discussions)
- **Email**: support@apiwatch.dev (coming soon)
