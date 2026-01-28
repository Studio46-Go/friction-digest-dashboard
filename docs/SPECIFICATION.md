# MFP v1.1 Specification

## Mathematical Flavor Profile Architecture

**Artifact ID:** MFP.MATHEMATICAL.FLAVOR.PROFILE.ARCHITECTURE.CANONICAL.v1.1

---

## 1. Input Model

### 1.1 Flavor Space

20-dimensional real vector space F ⊆ ℝ²⁰:

| Index | Dimension | Description |
|-------|-----------|-------------|
| 0 | UMAMI | Savory/glutamate intensity |
| 1 | SALT | Sodium perception |
| 2 | SWEET | Sweetness intensity |
| 3 | SOUR | Acidity level |
| 4 | BITTER | Bitter compounds |
| 5 | HEAT_PEPPER | Capsaicin heat |
| 6 | WARM_SPICE | Cinnamon/clove warmth |
| 7 | SMOKE | Smoky character |
| 8 | ROASTED | Maillard browning |
| 9 | FAT_RICH | Fat content/mouthfeel |
| 10 | CREAMY | Cream/dairy smoothness |
| 11 | HERBAL | Fresh herb character |
| 12 | CITRUS | Citrus brightness |
| 13 | ALLIUM | Onion/garlic pungency |
| 14 | FERMENT | Fermented complexity |
| 15 | EARTHY | Mushroom/root character |
| 16 | NUTTY | Nut/seed flavor |
| 17 | FLORAL | Floral aromatics |
| 18 | TEXTURE_CRISP | Crispy texture |
| 19 | TEXTURE_TENDER | Tender/soft texture |

### 1.2 Ingredient Signature Card

```typescript
interface IngredientCard {
  id: string;
  name: string;
  vector: FlavorVector;      // V_i ∈ ℝ²⁰
  potency: number;           // p_i ∈ [0, 1]
  volatility: number;        // v_i ∈ [0, 1]
  solubility: SolubilityClass;
  roles: Set<StructuralRole>;
  ingredientClass: IngredientClass;
}
```

### 1.3 Quantity Normalization

Role-based α computation:

```
α_i = min(1.0, q_i / Q_category)
```

Where Q_category depends on structural role and dish type.

### 1.4 Method & Heat Model

Method kernel transforms ingredient vector based on cooking method and heat level:

```
V_i' = K_method(V_i, s_i, v_i, H)
```

Supported methods: RAW, SAUTE, ROAST, GRILL, BRAISE, STEAM, FRY, SMOKE_METHOD, POACH, BLANCH, CONFIT, RAW_FINISH

---

## 2. Dish Vector Computation

Four-step pipeline:

1. **Normalize quantities** → α_i
2. **Apply method kernel** → V_i'
3. **Sum contributions** → V_dish = Σ α_i × p_i × V_i'
4. **Normalize to [0,1]** → V_norm = V_dish / max(5, ||V_dish||∞)

---

## 3. Scoring System

### 3.1 Similarity Score

```
S_sim = cosine(V_norm, B_target)
```

### 3.2 Balance Score

```
S_bal = 1 - (Σ_k W[k] × |V_norm[k] - B[k]|) / Σ_k W[k]
```

### 3.3 Structural Coverage

```
S_struct = |R_present ∩ R_required| / |R_required|
```

### 3.4 Clash Penalty

```
P_clash = Σ_{i<j} r_ij / N_pairs
```

### 3.5 Final Score

```
Score = 0.45×S_sim + 0.35×S_bal + 0.20×S_struct - 0.40×P_clash
```

---

## 4. Output Actions

### 4.1 Best Add-Ins
Rank candidate ingredients by score improvement.

### 4.2 Minimal Fix Moves
Identify largest balance deviations and suggest corrections.

### 4.3 Substitutions
Find role-compatible ingredients with similar vectors.

### 4.4 Method Adjustments
Recommend cooking method changes based on profile gaps.

---

## 5. Quantitative Integrity (ML400)

- All floating-point operations use banker's rounding
- Score reproducibility: identical inputs → identical outputs
- Tolerance bounds: ±0.0001 for intermediate calculations
- No stochastic elements in core computation

---

## 6. Calibration Status

| Status | Definition |
|--------|------------|
| A | Sensory-validated via blind tasting |
| B | Database-grounded (USDA, literature) |
| C | Prior estimate (culinary knowledge) |

---

## 7. Output Contract

```typescript
interface MFPEngineOutput {
  dishVector: FlavorVector;
  normalizedVector: FlavorVector;
  scored: ScoredResult;
  contributions: IngredientContribution[];
  structuralGate: StructuralGateResult;
  recommendations: Recommendation[];
  metadata: {
    version: "1.1";
    timestamp: string;
    styleTarget: string;
  };
}
```
