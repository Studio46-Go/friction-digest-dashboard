# Contributing to MFP

Thank you for your interest in contributing to the Mathematical Flavor Profile Engine!

## Ways to Contribute

### 1. Ingredient Calibration

The most impactful contribution is helping calibrate ingredient vectors:

- **Status C → B**: Ground a prior estimate in database values (USDA, food science literature)
- **Status B → A**: Validate with sensory testing (blind tasting protocols)

See [CALIBRATION_GUIDE.md](CALIBRATION_GUIDE.md) for detailed protocols.

### 2. New Ingredients

Submit new ingredient cards via [GitHub Issues](https://github.com/Studio46-Go/mfp-flavor-engine/issues/new?template=ingredient-submission.md).

Requirements:
- Canonical ID following naming convention (`category.name`)
- 20-dimensional flavor vector
- Potency, volatility, solubility class
- Structural roles and ingredient class
- Regional/cultural tags (if applicable)

### 3. New Style Targets

Propose new cuisine profiles via [GitHub Issues](https://github.com/Studio46-Go/mfp-flavor-engine/issues/new?template=style-target-request.md).

Requirements:
- Profile vector (20 dimensions, 0-1 normalized)
- Balance weights
- Reference dishes
- Cultural/culinary sources

### 4. Bug Fixes & Features

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit with clear messages
6. Push and open a Pull Request

## Development Setup

```bash
# Clone the repo
git clone https://github.com/Studio46-Go/mfp-flavor-engine.git
cd mfp-flavor-engine

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Code Style

- TypeScript strict mode
- ESM modules
- Clear, descriptive variable names
- JSDoc comments for public APIs
- Test coverage for new functionality

## Commit Messages

Follow conventional commits:

```
feat: add Korean style target
fix: correct salmon potency value
docs: update calibration guide
test: add vector math edge cases
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add entries to CHANGELOG if applicable
4. Request review from maintainers

## Code of Conduct

Be respectful, inclusive, and constructive. We're building a tool to celebrate culinary diversity.

## Questions?

Open a [Discussion](https://github.com/Studio46-Go/mfp-flavor-engine/discussions) or reach out to the maintainers.
