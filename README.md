# APIWatch 🕐

> Monitor API breaking changes and get alerted before your app breaks

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)

**APIWatch** is an open-source API monitoring service that automatically detects breaking changes in OpenAPI/Swagger specifications and alerts you before your integration breaks.

## 🎯 Problem It Solves

APIs change constantly. When a provider removes a required parameter or deprecates an endpoint, your app breaks. APIWatch:

- **Detects breaking changes** in OpenAPI/Swagger specs automatically
- **Alerts you instantly** via Email or Slack
- **Tracks version history** so you can see what changed
- **Monitors hourly** without manual intervention

## ✨ Features

### Breaking Change Detection

| Severity | What We Catch |
|----------|---------------|
| **Critical** | Removed endpoints, deleted HTTP methods, removed required parameters |
| **Major** | Removed response codes, removed required properties in schemas |
| **Minor** | Non-required property changes, description updates |

### Pre-Built Templates

Get started in seconds with 10+ popular API templates:

- 💳 **Stripe** - Payments
- 🐙 **GitHub** - Development
- 💼 **Slack** - Communication
- 🤖 **OpenAI** - AI/ML
- 📞 **Twilio** - Communication
- 📧 **SendGrid** - Email
- 🛍️ **Shopify** - E-commerce
- 🎮 **Discord** - Communication
- 📝 **Notion** - Productivity
- 📊 **Linear** - Productivity

## 🚀 Quick Start

### Option 1: Deploy to Cloudflare (Recommended)

```bash
# Clone the repository
git clone https://github.com/pageprincess/api-watch.git
cd api-watch/api-watch-worker

# Install dependencies
npm install

# Create D1 database and KV namespace
npx wrangler d1 create api-watch-db
npx wrangler kv namespace create API_WATCH_CACHE

# Update wrangler.toml with your IDs
# Then deploy
npx wrangler pages deploy .svelte-kit/output --project-name=api-watch
```

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

### Option 2: Use as a Library

```typescript
import { detectBreakingChanges, fetchSpec } from 'api-watcher';

// Monitor any OpenAPI spec
const oldSpec = await fetchSpec('https://api.example.com/openapi.json');
const newSpec = await fetchSpec('https://api.example.com/openapi.json');

const changes = detectBreakingChanges(oldSpec, newSpec);
if (changes.critical.length > 0) {
  console.alert('Critical breaking changes detected!');
}
```

## 📊 How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Cron Trigger   │────▶│  Spec Fetcher   │────▶│  Breaking Change │
│  (Every Hour)   │     │  (OpenAPI/Swagger)   │  Detector     │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Alert Service │◀────│  Database       │◀────│   Severity      │
│ (Email/Slack)   │     │  (D1 + KV)      │     │   Classifier    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🛠 Tech Stack

- **Runtime**: Cloudflare Workers (Edge computing)
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Database**: Cloudflare D1 (SQLite)
- **Cache**: Cloudflare KV
- **Alerts**: Resend (Email), Slack Webhooks

## 📁 Project Structure

```
api-watch-worker/
├── src/
│   ├── lib/
│   │   ├── spec-fetcher.ts      # Fetch OpenAPI specs
│   │   ├── breaking-detector.ts  # Detect breaking changes
│   │   ├── database.ts           # D1/KV operations
│   │   └── alert-service.ts      # Email/Slack alerts
│   ├── routes/
│   │   ├── api/check/+server.ts  # Cron endpoint
│   │   ├── api/monitored/+server.ts  # Manage APIs
│   │   └── api/templates/+server.ts   # API templates
│   └── routes/
│       └── +page.svelte         # Landing page
├── schema.sql                   # Database schema
└── wrangler.toml                # Cloudflare config
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests (when available)
npm test

# Type checking
npm run check
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

Areas where we'd love help:
- Add more API templates
- Improve breaking change detection accuracy
- Add more alert channels (Discord, Teams, etc.)
- UI/UX improvements for the landing page

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [GitHub Repository](https://github.com/pageprincess/api-watch)
- [Issues](https://github.com/pageprincess/api-watch/issues)
- [Discussions](https://github.com/pageprincess/api-watch/discussions)
- [Launch Discussion](https://github.com/pageprincess/api-watch/discussions/1)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=pageprincess/api-watch&type=Date)](https://star-history.com/#pageprincess/api-watch&Date)

---

**Built with ❤️ by [Auto Company](https://github.com/pageprincess/auto-company)** - *A fully autonomous AI company experiment*
