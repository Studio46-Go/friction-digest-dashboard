# MFP — Mathematical Flavor Profile Engine

> Deterministic, auditable flavor intelligence in 20 dimensions

[![CI](https://github.com/Studio46-Go/mfp-flavor-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/Studio46-Go/mfp-flavor-engine/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

MFP (Mathematical Flavor Profile) is a computational engine for analyzing and optimizing recipes using a 20-dimensional flavor space. It provides deterministic, auditable scoring of dishes against cuisine-specific targets, along with actionable recommendations for improvement.

## Features

- **20-dimensional flavor space** — UMAMI, SALT, SWEET, SOUR, BITTER, HEAT_PEPPER, WARM_SPICE, SMOKE, ROASTED, FAT_RICH, CREAMY, HERBAL, CITRUS, ALLIUM, FERMENT, EARTHY, NUTTY, FLORAL, TEXTURE_CRISP, TEXTURE_TENDER
- **Role-based normalization** — PRIMARY / SUPPORT / FINISH categories with dish-type-specific constants
- **Method kernels** — 12 cooking methods with heat/volatility transforms (GRILL, ROAST, SAUTE, etc.)
- **Scoring system** — Similarity, balance, structural coverage, clash penalty with weighted final formula
- **Recommendations** — Add-ins, fixes, substitutions, method adjustments
- **Cultural libraries** — AA Foodways (Midwest + Gulf States), with more to come

## Packages

| Package | Description |
|---------|-------------|
| [`@studio46/mfp-core`](packages/core) | Types, math primitives, and scoring algorithms |
| [`@studio46/mfp-data`](packages/data) | Ingredient libraries and cuisine style targets |
| [`@studio46/mfp-engine`](packages/engine) | Complete MFP engine with recommendations |

## Installation

```bash
npm install @studio46/mfp-engine
```

Or install individual packages:

```bash
npm install @studio46/mfp-core @studio46/mfp-data
```

## Quick Start

```typescript
import {
  runMFPEngine,
  getIngredient,
  CookingMethod,
  DishType,
} from '@studio46/mfp-engine';

const result = runMFPEngine({
  ingredients: [
    { card: getIngredient("chicken_breast"), quantity: 200 },
    { card: getIngredient("garlic"), quantity: 10 },
    { card: getIngredient("olive_oil"), quantity: 30 },
    { card: getIngredient("lemon_juice"), quantity: 15 },
    { card: getIngredient("basil"), quantity: 8 },
  ],
  method: CookingMethod.SAUTE,
  heatLevel: 0.7,
  dishType: DishType.COMPLETE_PLATE,
  styleTargetId: "italian",
});

console.log("Final Score:", result.scored.score.toFixed(2));
console.log("Components:", result.scored.components);
console.log("Top Recommendations:", result.recommendations.slice(0, 3));
```

## Style Targets

| ID | Name | Characteristics |
|----|------|-----------------|
| `italian` | Italian (Classic) | Umami, herbal, allium, fat-rich |
| `japanese` | Japanese (Washoku) | Umami, ferment, delicate |
| `mexican` | Mexican (Traditional) | Heat, citrus, earthy |
| `thai` | Thai | Sweet-sour-heat balance |
| `french` | French (Classic) | Fat, cream, roasted |
| `indian` | Indian (North) | Warm spice, heat, allium |
| `bbq` | American BBQ | Smoke, sweet, fat, tender |
| `mediterranean` | Mediterranean | Herbal, citrus, olive oil |
| `soul_food` | Soul Food (AA Core) | Smoke, bitter greens, fat, tender |
| `gulf_creole` | Gulf Creole (Louisiana) | Heat, roux, seafood, allium |

## Scoring Formula

```
Score = 0.45×S_sim + 0.35×S_bal + 0.20×S_struct - 0.40×P_clash

Where:
  S_sim    = cosine similarity to target profile
  S_bal    = weighted balance score
  S_struct = structural role coverage
  P_clash  = ingredient class clash penalty
```

## Calibration Status

Ingredient vectors have calibration status indicators:

| Status | Meaning | Count |
|--------|---------|-------|
| **A** | Sensory-validated (blind tasting) | 0 |
| **B** | Database-grounded | ~37 |
| **C** | Prior estimate (needs calibration) | ~100 |

## Documentation

- [Specification (MFP v1.1)](docs/SPECIFICATION.md)
- [API Reference](docs/API_REFERENCE.md)
- [Calibration Guide](docs/CALIBRATION_GUIDE.md)
- [Contributing](docs/CONTRIBUTING.md)

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## License

MIT © Studio46-Go
