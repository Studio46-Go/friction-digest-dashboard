# MFP Calibration Guide

This guide explains how to calibrate ingredient vectors from prior estimates (C) to validated values (A).

## Calibration Status Levels

| Status | Name | Requirements |
|--------|------|--------------|
| **C** | Prior Estimate | Initial vector based on culinary knowledge |
| **B** | Database-Grounded | Values cross-referenced with food databases |
| **A** | Sensory-Validated | Confirmed via blind tasting protocol |

## C → B: Database Grounding

### Data Sources

1. **USDA FoodData Central** - Nutrient composition
2. **Volatile Compounds Database** - Aroma profiles
3. **Food Pairing Database** - Flavor compound analysis
4. **Academic Literature** - Food science journals

### Process

1. Look up the ingredient in authoritative databases
2. Map database values to MFP dimensions:
   - Glutamate content → UMAMI
   - Sodium content → SALT
   - Sugar content → SWEET
   - pH / organic acids → SOUR
   - Phenolic compounds → BITTER
   - Capsaicin levels → HEAT_PEPPER
   - Terpene profiles → WARM_SPICE, HERBAL, CITRUS
   - Maillard reaction products → ROASTED
   - Fat content → FAT_RICH
   - Sulfur compounds → ALLIUM
   - Fermentation markers → FERMENT

3. Document sources in the PR

### Example

```typescript
// Before (C - prior estimate)
[2.0, 0.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0]

// After (B - database grounded)
// USDA: 100g chicken breast contains ~70mg glutamate
// Food science: raw chicken has low volatiles, neutral pH
[2.2, 0.4, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.2, 0.4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.2]
```

## B → A: Sensory Validation

### Blind Tasting Protocol

#### Materials
- Target ingredient (prepared consistently)
- Reference samples for each dimension
- Scoring sheets (0-5 scale)
- Minimum 5 trained tasters

#### Reference Standards

| Dimension | Reference Standard |
|-----------|-------------------|
| UMAMI | 0.5% MSG solution (=5.0) |
| SALT | 0.5% NaCl solution (=5.0) |
| SWEET | 5% sucrose solution (=5.0) |
| SOUR | 0.05% citric acid (=5.0) |
| BITTER | 0.05% caffeine (=5.0) |
| HEAT_PEPPER | Diluted capsaicin extract |
| WARM_SPICE | Cinnamon/clove infusion |
| SMOKE | Liquid smoke dilution |
| ROASTED | Toasted bread sample |
| FAT_RICH | Cream sample |
| HERBAL | Fresh basil infusion |
| CITRUS | Lemon zest infusion |
| ALLIUM | Onion juice dilution |
| FERMENT | Miso solution |

#### Procedure

1. Present ingredient sample blind (no identification)
2. Tasters score each dimension 0-5 against references
3. Collect at least 5 independent scores
4. Calculate mean and standard deviation
5. Discard outliers (>2 SD from mean)
6. Final value = trimmed mean / 5.0 × max_scale

#### Acceptance Criteria

- Coefficient of variation < 20% for each dimension
- No systematic bias detected
- At least 5 valid tasters

### Documentation

Submit calibration data with:
- Raw taster scores (anonymized)
- Statistical summary
- Methodology notes
- Date and conditions

## Contributing Calibrations

1. Fork the repository
2. Update ingredient vector in appropriate library
3. Change `calibrationStatus` from C → B or B → A
4. Add calibration notes to PR description
5. Include data sources or tasting protocol results

## Batch Calibration Projects

We welcome organized calibration efforts:

- **Regional Ingredients**: Calibrate a cuisine's core ingredients together
- **Ingredient Categories**: Calibrate all proteins, all herbs, etc.
- **Academic Partnerships**: Partner with food science programs

Contact maintainers to coordinate batch calibration projects.
