# Contributing to APIWatch

First off, thank you for considering contributing to APIWatch! We appreciate any help you can provide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

Please be respectful and constructive. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues.

When creating bug reports, include:
- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Environment** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:
- **Check if already requested**
- **Provide use cases**
- **Explain the value**
- **Consider implementation complexity**

### Pull Requests

We welcome PRs! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/api-watch.git
cd api-watch

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Pull Request Process

1. **Ensure tests pass**: `npm test`
2. **Update documentation**: If you changed functionality
3. **Clean commits**: One logical change per commit
4. **Clear PR description**: Explain what and why

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test these changes?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No new warnings
```

## Coding Standards

- **TypeScript**: Use type annotations
- **Naming**: camelCase for variables, PascalCase for classes
- **Comments**: JSDoc for public APIs
- **Formatting**: Prettier (auto-formatted on commit)

## Areas Where We Need Help

Looking for contributors for:
- GraphQL schema support
- Docker image creation
- CLI tool development
- Additional API providers
- Documentation improvements
- Test coverage

Check issues with `good first issue` label to get started!

## Questions?

Feel free to open an issue or start a [Discussion](https://github.com/pageprincess/api-watch/discussions).

---

Thank you for contributing to APIWatch!
