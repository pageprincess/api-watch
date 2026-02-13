# APIWatch - Technical Stack

**Status**: Pre-development (Skeleton)
**Last Updated**: 2026-02-13
**Decision Maker**: CTO (Werner Vogels)

## Core Principles

- **Everything Fails**: Design for failure from day one
- **You Build It, You Run It**: No separate ops team
- **Boring Technology**: Mature tech unless new tech has 10x advantage
- **Monolith First**: Start simple, extract services when needed
- **Serverless by Default**: Minimize operational overhead

---

## Recommended Technology Stack

### Backend Runtime

**Choice: Node.js (TypeScript)**

**Rationale:**
- Ecosystem dominance for API tooling (OpenAPI parsers, GraphQL clients)
- Cloudflare Workers support for edge deployment
- Async/async model fits monitoring workflows perfectly
- Large talent pool if needed (though we're autonomous)

**Alternative Considered:**
- Python: Great for scraping, but Workers support is limited
- Go: Excellent performance, but slower development velocity
- Rust: Overkill for this use case, development too slow

**Decision**: Node.js/TypeScript - best balance of ecosystem, deployment options, and development speed.

---

### Framework

**Choice: Hono (for Cloudflare Workers)**

**Rationale:**
- Native Cloudflare Workers support
- Lightweight and fast
- TypeScript-first design
- Edge-compatible middleware ecosystem

**Alternative Considered:**
- Next.js: Too heavy for an API monitoring service
- Express: Not Workers-compatible
- Fastify: Great for Node.js, but Workers is our deployment target

**Decision**: Hono - purpose-built for the edge where our monitoring jobs run.

---

### Database & Storage

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Primary Database | **Cloudflare D1** (SQLite) | Store monitored APIs, change history, users |
| Cache | **Cloudflare KV** | Cache API specs, rate limiting |
| File Storage | **Cloudflare R2** | Store OpenAPI/GraphQL spec snapshots |
| Search | **SQLite FTS5** (in D1) | Search change history |

**Rationale:**
- All-in-one Cloudflare stack minimizes operational complexity
- D1 gives us SQL without managing servers
- KV provides global edge caching
- R2 is S3-compatible without egress fees
- Single billing relationship, single dashboard

**Alternative Considered:**
- PostgreSQL (Neon/Supabase): More features, but another vendor
- MongoDB: Flexible schema, but operational overhead
- Redis: Faster, but another service to manage

**Decision**: Cloudflare D1/KV/R2 - boring, integrated, and free tier is generous.

---

### API Specification Parsing

| Task | Library |
|------|---------|
| OpenAPI 3.x | `swagger-parser` |
| OpenAPI 3.x diff | `@apidevtools/swagger-parser` + custom diff |
| GraphQL | `graphql` + `graphql-tools` |
| JSON Schema | `ajv` |

**Rationale:**
- Mature, well-maintained libraries
- Active community support
- Cloudflare Workers compatible

---

### Alerting & Integrations

| Channel | Implementation |
|---------|----------------|
| Email | **Cloudflare Workers** + **Resend** (email API) |
| Slack | Slack Incoming Webhooks |
| Webhooks | Custom HTTP POST with retry logic |
| PagerDuty | PagerDuty Events API |

**Rationale:**
- Resend: Modern email API, free tier, better DX than SendGrid
- Slack webhooks: Simple, reliable, no OAuth needed
- Custom webhooks: Maximum flexibility for integrations

---

### Task Scheduling

**Choice: Cloudflare Workers Cron Triggers**

**Rationale:**
- Native to Workers platform
- No additional infrastructure
- Supports cron-style scheduling (e.g., `*/30 * * * *` for every 30 minutes)
- Automatic retries with exponential backoff

**Alternative Considered:**
- BullMQ (Redis): More features, but requires Redis instance
- GitHub Actions: Free, but not designed for frequent jobs (every 5 min max)
- cron-job.org: Third-party dependency

**Decision**: Cloudflare Cron Triggers - integrated, free, and reliable.

---

### Monitoring & Observability

| Need | Solution |
|------|----------|
| Application Metrics | **Cloudflare Workers Analytics** |
| Error Tracking | **Sentry** (Workers compatible) |
| Uptime Monitoring | **Built-in** ( Workers Cron success/failure) |
| Logging | **Cloudflare Logs** (tail with `wrangler`) |

**Rationale:**
- Workers Analytics is free and already integrated
- Sentry has excellent Workers support
- No need for separate monitoring stack initially

**Alternative Considered:**
- Datadog/New Relic: Overkill for initial version
- Prometheus: Too complex for serverless

---

### Frontend (Dashboard)

**Choice: SvelteKit**

**Rationale:**
- Cloudflare Pages adapter out of the box
- Smaller bundle than React
- Great performance (important for dashboards)
- TypeScript native

**Alternative Considered:**
- Next.js: Not Cloudflare-friendly
- Vue.js: Valid option, but Svelte is simpler
- Remix: Too heavy for a simple dashboard

**Decision**: SvelteKit - best balance of performance, simplicity, and Cloudflare integration.

---

### Authentication

**Choice: Cloudflare Access (for dashboard)**

**Rationale:**
- Zero-trust auth
- Supports email OTP, GitHub OAuth, Google OAuth
- No code needed—just configuration
- Free for basic use

**Alternative Considered:**
- Clerk/Auth0: More features, but another vendor and cost
- Custom implementation: Reinventing the wheel

**Decision**: Cloudflare Access - boring, integrated, and zero maintenance.

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User/Browser                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Pages (SvelteKit Dashboard)         │
│              Protected by Cloudflare Access                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│           Cloudflare Workers (API + Cron Jobs)              │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │  API Spec       │  Breaking       │  Alerting        │   │
│  │  Fetcher        │  Change         │  Worker          │   │
│  │                 │  Detector       │                  │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │    D1    │   │    KV    │   │    R2    │
    │ (Database)│   │  (Cache)  │   │ (Storage) │
    └───────────┘   └───────────┘   └───────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   Resend     │
                  │   (Email)    │
                  └───────────────┘
```

---

## Operational Considerations

### Cost Structure (Early Stage)

| Service | Free Tier | Expected Overrun |
|---------|-----------|------------------|
| Workers | 100k req/day free | $5/10M requests after |
| D1 | 5GB storage + 25M reads/day free | $0.50/GB after |
| KV | 100k reads/day free | $0.50/1M reads after |
| R2 | 10GB storage + 1M Class A ops free | $0.015/GB after |
| Pages | Unlimited bandwidth | $0 (free tier) |
| Resend | 3k emails/month free | $15/100k emails after |

**Estimated Monthly Cost** (1-100 users, 100 monitored APIs): **$0-15/month**

### Scaling Strategy

1. **0-100 Monitored APIs**: Single Worker, single D1 database
2. **100-1,000 Monitored APIs**:
   - Add Workers KV for aggressive caching
   - Implement rate limiting per API
   - Shard D1 by customer if needed
3. **1,000-10,000 Monitored APIs**:
   - Extract cron jobs to dedicated Workers
   - Implement queue-based alerting (Cloudflare Queues)
   - Consider read replicas for dashboard

### Failure Mode Analysis

| Failure | Blast Radius | Mitigation |
|---------|--------------|------------|
| Worker fails to fetch API spec | Single API not checked | Retry with exponential backoff, alert admin |
| D1 database unavailable | All APIs | Workers KV cache serves stale data, alert admin |
| Resend email outage | Email alerts | Retry, fallback to webhook if configured |
| Cloudflare outage | Entire service | Status page, auto-retry when back |

---

## Not Doing (For Now)

| Technology | Reason |
|------------|--------|
| GraphQL API | REST is sufficient for MVP |
| WebSocket monitoring | Overkill for periodic checks |
| Machine learning prediction | Rule-based detection works well |
| Multi-region deployment | Cloudflare already global |

---

## Next Steps for Development

1. Set up Cloudflare account and Workers
2. Initialize `wrangler` project with Hono
3. Create D1 database schema
4. Implement first API spec fetcher
5. Implement OpenAPI diff logic
6. Wire up Resend for email alerts
7. Build basic SvelteKit dashboard

---

*This stack follows Werner Vogels' principles: boring technology, operational simplicity, and designing for failure. Start monolithic, extract services when needed.*
