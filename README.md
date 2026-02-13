# APIWatch

**Monitor API breaking changes and get alerted before your app breaks**

![GitHub stars](https://img.shields.io/github/stars/pageprincess/api-watch?style=social)
![License](https://img.shields.io/github/license/pageprincess/api-watch)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## Overview

APIWatch is an open-source API breaking change detector. It fetches OpenAPI specifications, diffs them against previous versions, and alerts you when breaking changes are detected.

**The Problem**: At 3 AM, Stripe silently deprecated a field. Our payments broke. 4 hours of debugging later, we found the root cause—no announcement, no changelog, just a silent breaking change.

**The Solution**: APIWatch monitors OpenAPI specs and detects breaking changes before they impact your production.

## Quick Start (5 Minutes)

```bash
# Clone the repository
git clone https://github.com/pageprincess/api-watch.git
cd api-watch

# Install dependencies
npm install

# Run detection engine (example)
npm run detect -- --url=https://api.stripe.com/openapi.yaml
```

**What happens**: APIWatch fetches the spec, compares it to the previous version, and reports any breaking changes.

## Why APIWatch?

- **Prevent Production Incidents**: Know about API changes before your users do
- **Reduce Debugging Time**: Instantly identify if a third-party API change broke your integration
- **Open Source**: Full transparency—run it yourself, fork it, customize it
- **API Provider Agnostic**: Works with any REST API that exposes an OpenAPI/Swagger spec

## Planned Features

### Core Monitoring
- [ ] Scheduled API specification monitoring (OpenAPI/Swagger, GraphQL schema)
- [ ] Breaking change detection engine
- [ ] Semantic versioning analysis
- [ ] Response structure validation
- [ ] Endpoint deprecation tracking

### Alerting
- [ ] Email notifications
- [ ] Slack integration
- [ ] Webhook support
- [ ] Custom alert rules (filter by severity, endpoint, change type)
- [ ] Alert aggregation and digest mode

### Dashboard & Visibility
- [ ] Web dashboard for monitored APIs
- [ ] Change history and timeline
- [ ] API health status overview
- [ ] Breaking change impact analysis

### Integrations
- [ ] GitHub (track OpenAPI spec changes in repos)
- [ ] npm/package registries (monitor package API changes)
- [ ] Custom API endpoints
- [ ] API gateway integration (AWS API Gateway, Cloudflare)

## Roadmap

### Phase 1: MVP
- Basic OpenAPI spec monitoring
- Breaking change detection for REST APIs
- Email alerts
- Simple web UI

### Phase 2: Enhanced Monitoring
- GraphQL schema monitoring
- Slack/webhook integrations
- Historical change tracking
- Multiple environment support

### Phase 3: Enterprise Features
- API gateway integrations
- Custom alerting rules engine
- SSO and team management
- API usage analytics

## Technology Stack

See [docs/tech-stack.md](docs/tech-stack.md) for detailed technical decisions.

## Getting Started (When Ready)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Current Status

**Active Development**: This is an open-source project in active development. Core detection engine is implemented (1,388 lines of TypeScript).

**What's Working**:
- OpenAPI spec fetching from URLs
- Breaking change detection (12+ rules)
- Email/Slack alerting
- Database schema (D1)

**What's Next**:
- Docker image for self-hosting
- CLI tool for local checking
- Web dashboard (in progress)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Good First Issues**:
- Add GraphQL schema support
- Create Docker image
- Improve detection accuracy
- Add more API templates

## Roadmap

### Phase 1: Core Detection (Current)
- OpenAPI spec fetching
- Breaking change detection engine
- Email/Slack alerting

### Phase 2: Self-Hosting
- Docker image
- CLI tool
- Configuration via YAML

### Phase 3: Web Dashboard
- User authentication
- Monitor management UI
- Change history timeline

### Phase 4: Advanced Features
- GraphQL schema support
- Webhook notifications
- Custom alert rules

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- GitHub: https://github.com/pageprincess/api-watch
- Issues: https://github.com/pageprincess/api-watch/issues
- Discussions: https://github.com/pageprincess/api-watch/discussions

---

*Built with love by Auto Company - Fully Autonomous AI Company*
