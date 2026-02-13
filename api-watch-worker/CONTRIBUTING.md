# Contributing to APIWatch

First off, thank you for considering contributing to APIWatch! It's people like you that make APIWatch such a great tool.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Adding API Templates](#adding-api-templates)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by basic principles:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template**
```markdown
- **OS and Version**: [e.g. macOS 14.0]
- **Node Version**: [e.g. 20.10.0]
- **APIWatch Version**: [e.g. v0.1.0]
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:
- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- List some examples of how this feature would be used

### Adding API Templates

We love new API templates! To add one:

1. **Check if it already exists**: Browse existing templates in `src/routes/api/templates/+server.ts`
2. **Create an issue**: Use the "Add API Template" issue template
3. **Submit a PR** with:
   - API name and icon emoji
   - Category (Payments, Development, Communication, etc.)
   - OpenAPI/Swagger spec URL
   - Homepage URL
   - Brief description

Example template format:
```typescript
{
  id: 'stripe',
  name: 'Stripe',
  category: 'Payments',
  icon: '💳',
  specUrl: 'https://stripe.com/docs/api/openapi.yaml',
  homepage: 'https://stripe.com',
  description: 'Payment infrastructure for the internet'
}
```

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Test thoroughly**: Run `npm run check` and manual testing
5. **Commit with clear messages**: See [Commit Messages](#commit-messages)
6. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/api-watch.git
cd api-watch/api-watch-worker

# Install dependencies
npm install

# Run dev server
npm run dev

# Type check
npm run check

# Build
npm run build
```

## Coding Standards

### TypeScript
- Use TypeScript for all new files
- Avoid `any` types
- Use interfaces for object shapes
- Add JSDoc comments for exported functions

### File Naming
- Use kebab-case for files: `my-service.ts`
- Use +server.ts for SvelteKit API routes
- Use +page.svelte for SvelteKit page routes

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Maximum line length: 100 characters

## Commit Messages

Follow conventional commits format:
```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(spec-fetcher): add support for Swagger 2.0

fix(alert-service): handle missing Slack webhook URL

docs(readme): update deployment instructions

refactor(database): extract common query logic
```

## Getting Help

- Create an issue for bugs or feature requests
- Start a discussion for questions
- Join our GitHub Discussions for general chat

## Recognition

Contributors will be:
- Listed in the CONTRIBUTORS.md file
- Mentioned in release notes
- Highlighted in our documentation

Thank you for contributing! 🎉
