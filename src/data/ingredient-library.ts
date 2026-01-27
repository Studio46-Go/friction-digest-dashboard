/**
 * MFP v1.1 - Ingredient Library (Section 5)
 *
 * Sample ingredient signature cards covering major structural roles
 * and ingredient classes.
 *
 * Vector format: [UMAMI, SALT, SWEET, SOUR, BITTER, HEAT_PEPPER, WARM_SPICE,
 *   SMOKE, ROASTED, FAT_RICH, CREAMY, HERBAL, CITRUS, ALLIUM, FERMENT,
 *   EARTHY, NUTTY, FLORAL, TEXTURE_CRISP, TEXTURE_TENDER]
 */

import { flavorVector } from "../types/flavor-space.js";
import {
  StructuralRole,
  SolubilityClass,
  IngredientClass,
} from "../types/ingredient.js";
import type { IngredientCard } from "../types/ingredient.js";

function card(
  id: string,
  name: string,
  vector: number[],
  potency: number,
  volatility: number,
  solubility: SolubilityClass,
  roles: StructuralRole[],
  ingredientClass: IngredientClass
): IngredientCard {
  return {
    id,
    name,
    vector: flavorVector(vector),
    potency,
    volatility,
    solubility,
    roles: new Set(roles),
    ingredientClass,
  };
}

export const INGREDIENT_LIBRARY: Map<string, IngredientCard> = new Map();

// ─── Proteins ───────────────────────────────────────────────────────────────

const PROTEINS: IngredientCard[] = [
  card(
    "chicken_breast",
    "Chicken Breast",
    //  UMA  SLT  SWT  SOR  BIT  HEA  WRM  SMK  RST  FAT  CRM  HRB  CIT  ALL  FRM  ERT  NUT  FLO  CRP  TND
    [2.0, 0.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0],
    0.7, 0.1, SolubilityClass.WATER,
    [StructuralRole.PROTEIN],
    IngredientClass.NEUTRAL
  ),
  card(
    "beef_chuck",
    "Beef Chuck",
    [3.5, 0.5, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 3.5],
    0.85, 0.15, SolubilityClass.WATER,
    [StructuralRole.PROTEIN],
    IngredientClass.RED_MEAT
  ),
  card(
    "salmon",
    "Salmon Fillet",
    [3.0, 0.3, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 3.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5],
    0.8, 0.2, SolubilityClass.WATER,
    [StructuralRole.PROTEIN, StructuralRole.FAT],
    IngredientClass.FISHY
  ),
  card(
    "shrimp",
    "Shrimp",
    [3.5, 0.8, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.5],
    0.8, 0.15, SolubilityClass.WATER,
    [StructuralRole.PROTEIN],
    IngredientClass.SHELLFISH
  ),
  card(
    "tofu",
    "Firm Tofu",
    [1.5, 0.2, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 3.0],
    0.5, 0.05, SolubilityClass.WATER,
    [StructuralRole.PROTEIN],
    IngredientClass.NEUTRAL
  ),
];

// ─── Fats ───────────────────────────────────────────────────────────────────

const FATS: IngredientCard[] = [
  card(
    "butter",
    "Butter",
    [0.5, 0.3, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 4.5, 3.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.5],
    0.9, 0.3, SolubilityClass.FAT,
    [StructuralRole.FAT],
    IngredientClass.MILK
  ),
  card(
    "olive_oil",
    "Extra Virgin Olive Oil",
    [0.3, 0.0, 0.0, 0.0, 0.5, 0.3, 0.0, 0.0, 0.0, 4.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.85, 0.4, SolubilityClass.FAT,
    [StructuralRole.FAT],
    IngredientClass.NEUTRAL
  ),
  card(
    "cream",
    "Heavy Cream",
    [0.3, 0.1, 0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 4.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
    0.8, 0.1, SolubilityClass.FAT,
    [StructuralRole.FAT],
    IngredientClass.MILK
  ),
  card(
    "sesame_oil",
    "Toasted Sesame Oil",
    [0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 3.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 3.5, 0.0, 0.0, 0.0],
    0.9, 0.6, SolubilityClass.FAT,
    [StructuralRole.FAT, StructuralRole.AROMATIC],
    IngredientClass.NEUTRAL
  ),
];

// ─── Acids ──────────────────────────────────────────────────────────────────

const ACIDS: IngredientCard[] = [
  card(
    "lemon_juice",
    "Lemon Juice",
    [0.0, 0.0, 0.3, 4.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0],
    0.9, 0.7, SolubilityClass.WATER,
    [StructuralRole.ACID, StructuralRole.HERB_FINISH],
    IngredientClass.CITRUS
  ),
  card(
    "lime_juice",
    "Lime Juice",
    [0.0, 0.0, 0.2, 4.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 4.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0],
    0.9, 0.7, SolubilityClass.WATER,
    [StructuralRole.ACID, StructuralRole.HERB_FINISH],
    IngredientClass.CITRUS
  ),
  card(
    "red_wine_vinegar",
    "Red Wine Vinegar",
    [0.3, 0.0, 0.2, 4.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 1.5, 0.3, 0.0, 0.0, 0.0, 0.0],
    0.85, 0.5, SolubilityClass.WATER,
    [StructuralRole.ACID],
    IngredientClass.FERMENTED
  ),
  card(
    "rice_vinegar",
    "Rice Vinegar",
    [0.2, 0.0, 0.5, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 1.0, 0.0, 0.0, 0.3, 0.0, 0.0],
    0.7, 0.4, SolubilityClass.WATER,
    [StructuralRole.ACID],
    IngredientClass.FERMENTED
  ),
];

// ─── Aromatics & Alliums ────────────────────────────────────────────────────

const AROMATICS: IngredientCard[] = [
  card(
    "garlic",
    "Garlic",
    [1.5, 0.0, 0.3, 0.0, 0.0, 0.5, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 4.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.95, 0.6, SolubilityClass.WATER,
    [StructuralRole.AROMATIC],
    IngredientClass.ALLIUM_CLASS
  ),
  card(
    "onion",
    "Yellow Onion",
    [0.5, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.3, 0.0, 0.0, 0.5, 0.0],
    0.7, 0.4, SolubilityClass.WATER,
    [StructuralRole.AROMATIC, StructuralRole.VEGETABLE],
    IngredientClass.ALLIUM_CLASS
  ),
  card(
    "ginger",
    "Fresh Ginger",
    [0.0, 0.0, 0.3, 0.3, 0.0, 1.5, 1.5, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0],
    0.9, 0.7, SolubilityClass.WATER,
    [StructuralRole.AROMATIC, StructuralRole.HEAT_AGENT],
    IngredientClass.SPICY
  ),
  card(
    "shallot",
    "Shallot",
    [0.3, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 3.5, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0],
    0.7, 0.4, SolubilityClass.WATER,
    [StructuralRole.AROMATIC],
    IngredientClass.ALLIUM_CLASS
  ),
];

// ─── Herbs (Fresh Finish) ───────────────────────────────────────────────────

const HERBS: IngredientCard[] = [
  card(
    "basil",
    "Fresh Basil",
    [0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0],
    0.8, 0.85, SolubilityClass.WATER,
    [StructuralRole.HERB_FINISH],
    IngredientClass.NEUTRAL
  ),
  card(
    "cilantro",
    "Fresh Cilantro",
    [0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 1.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
    0.75, 0.9, SolubilityClass.WATER,
    [StructuralRole.HERB_FINISH],
    IngredientClass.NEUTRAL
  ),
  card(
    "parsley",
    "Fresh Parsley",
    [0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 0.5, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.6, 0.8, SolubilityClass.WATER,
    [StructuralRole.HERB_FINISH],
    IngredientClass.NEUTRAL
  ),
  card(
    "mint",
    "Fresh Mint",
    [0.0, 0.0, 0.5, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0],
    0.75, 0.85, SolubilityClass.WATER,
    [StructuralRole.HERB_FINISH],
    IngredientClass.NEUTRAL
  ),
  card(
    "rosemary",
    "Fresh Rosemary",
    [0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0],
    0.85, 0.5, SolubilityClass.FAT,
    [StructuralRole.HERB_FINISH, StructuralRole.AROMATIC],
    IngredientClass.NEUTRAL
  ),
];

// ─── Spices ─────────────────────────────────────────────────────────────────

const SPICES: IngredientCard[] = [
  card(
    "cumin",
    "Ground Cumin",
    [0.0, 0.0, 0.0, 0.0, 0.3, 0.3, 3.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 1.0, 0.0, 0.0, 0.0],
    0.9, 0.5, SolubilityClass.FAT,
    [StructuralRole.AROMATIC],
    IngredientClass.SPICY
  ),
  card(
    "paprika_smoked",
    "Smoked Paprika",
    [0.3, 0.0, 0.5, 0.0, 0.0, 1.5, 1.5, 3.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    0.85, 0.4, SolubilityClass.FAT,
    [StructuralRole.AROMATIC, StructuralRole.HEAT_AGENT],
    IngredientClass.SPICY
  ),
  card(
    "black_pepper",
    "Black Pepper",
    [0.0, 0.0, 0.0, 0.0, 0.3, 3.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.5, 0.0, 0.3, 0.0, 0.0],
    0.9, 0.5, SolubilityClass.FAT,
    [StructuralRole.HEAT_AGENT],
    IngredientClass.SPICY
  ),
  card(
    "cinnamon",
    "Ground Cinnamon",
    [0.0, 0.0, 2.0, 0.0, 0.3, 0.0, 4.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 1.0, 0.0, 0.0],
    0.95, 0.6, SolubilityClass.FAT,
    [StructuralRole.AROMATIC],
    IngredientClass.SPICY
  ),
  card(
    "chili_flakes",
    "Red Chili Flakes",
    [0.0, 0.0, 0.0, 0.0, 0.0, 4.5, 0.5, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0],
    0.9, 0.3, SolubilityClass.FAT,
    [StructuralRole.HEAT_AGENT],
    IngredientClass.SPICY
  ),
];

// ─── Umami Boosters ─────────────────────────────────────────────────────────

const UMAMI_BOOSTERS: IngredientCard[] = [
  card(
    "soy_sauce",
    "Soy Sauce",
    [4.5, 4.0, 0.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.95, 0.3, SolubilityClass.WATER,
    [StructuralRole.UMAMI_BOOST],
    IngredientClass.FERMENTED
  ),
  card(
    "miso",
    "White Miso Paste",
    [4.0, 3.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 3.5, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.9, 0.2, SolubilityClass.WATER,
    [StructuralRole.UMAMI_BOOST],
    IngredientClass.FERMENTED
  ),
  card(
    "tomato_paste",
    "Tomato Paste",
    [3.5, 0.5, 1.5, 1.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.85, 0.1, SolubilityClass.WATER,
    [StructuralRole.UMAMI_BOOST, StructuralRole.ACID],
    IngredientClass.NEUTRAL
  ),
  card(
    "fish_sauce",
    "Fish Sauce",
    [5.0, 4.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.95, 0.3, SolubilityClass.WATER,
    [StructuralRole.UMAMI_BOOST],
    IngredientClass.FISHY
  ),
  card(
    "parmesan",
    "Parmesan Cheese",
    [4.5, 3.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.5, 1.5, 0.0, 0.0, 0.0, 2.0, 0.0, 1.0, 0.0, 0.5, 0.0],
    0.9, 0.15, SolubilityClass.FAT,
    [StructuralRole.UMAMI_BOOST, StructuralRole.FAT],
    IngredientClass.MILK
  ),
];

// ─── Starches ───────────────────────────────────────────────────────────────

const STARCHES: IngredientCard[] = [
  card(
    "rice_white",
    "White Rice",
    [0.3, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 3.5],
    0.4, 0.05, SolubilityClass.DRY,
    [StructuralRole.STARCH],
    IngredientClass.NEUTRAL
  ),
  card(
    "pasta",
    "Dried Pasta",
    [0.5, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.5, 0.0, 0.0, 3.0],
    0.4, 0.05, SolubilityClass.DRY,
    [StructuralRole.STARCH],
    IngredientClass.NEUTRAL
  ),
  card(
    "potato",
    "Potato",
    [0.3, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.5, 3.0],
    0.4, 0.05, SolubilityClass.WATER,
    [StructuralRole.STARCH, StructuralRole.VEGETABLE],
    IngredientClass.NEUTRAL
  ),
];

// ─── Vegetables ─────────────────────────────────────────────────────────────

const VEGETABLES: IngredientCard[] = [
  card(
    "broccoli",
    "Broccoli",
    [0.3, 0.0, 0.3, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.5, 2.0],
    0.5, 0.15, SolubilityClass.WATER,
    [StructuralRole.VEGETABLE],
    IngredientClass.CRUCIFEROUS
  ),
  card(
    "spinach",
    "Spinach",
    [0.3, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 2.5],
    0.5, 0.2, SolubilityClass.WATER,
    [StructuralRole.VEGETABLE],
    IngredientClass.BITTER_GREEN
  ),
  card(
    "bell_pepper",
    "Bell Pepper",
    [0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.5, 1.0],
    0.5, 0.3, SolubilityClass.WATER,
    [StructuralRole.VEGETABLE],
    IngredientClass.NEUTRAL
  ),
  card(
    "mushroom",
    "Button Mushroom",
    [2.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 3.0, 0.5, 0.0, 0.5, 2.5],
    0.6, 0.15, SolubilityClass.WATER,
    [StructuralRole.VEGETABLE, StructuralRole.UMAMI_BOOST],
    IngredientClass.NEUTRAL
  ),
  card(
    "carrot",
    "Carrot",
    [0.0, 0.0, 2.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 1.0, 2.0],
    0.4, 0.1, SolubilityClass.WATER,
    [StructuralRole.VEGETABLE],
    IngredientClass.NEUTRAL
  ),
];

// ─── Sweeteners ─────────────────────────────────────────────────────────────

const SWEETENERS: IngredientCard[] = [
  card(
    "honey",
    "Honey",
    [0.0, 0.0, 4.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.5],
    0.85, 0.3, SolubilityClass.WATER,
    [StructuralRole.SWEETENER],
    IngredientClass.SWEET_DESSERT
  ),
  card(
    "brown_sugar",
    "Brown Sugar",
    [0.0, 0.0, 4.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.9, 0.1, SolubilityClass.WATER,
    [StructuralRole.SWEETENER],
    IngredientClass.SWEET_DESSERT
  ),
];

// ─── Texture Agents ─────────────────────────────────────────────────────────

const TEXTURE_AGENTS: IngredientCard[] = [
  card(
    "breadcrumbs_panko",
    "Panko Breadcrumbs",
    [0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 4.0, 0.0],
    0.3, 0.05, SolubilityClass.DRY,
    [StructuralRole.TEXTURE_AGENT],
    IngredientClass.NEUTRAL
  ),
  card(
    "walnuts",
    "Walnuts",
    [0.3, 0.0, 0.3, 0.0, 0.5, 0.0, 0.0, 0.0, 0.5, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 4.0, 0.0, 3.0, 0.0],
    0.6, 0.1, SolubilityClass.FAT,
    [StructuralRole.TEXTURE_AGENT, StructuralRole.FAT],
    IngredientClass.NEUTRAL
  ),
];

// Register all ingredients
const ALL_INGREDIENTS = [
  ...PROTEINS,
  ...FATS,
  ...ACIDS,
  ...AROMATICS,
  ...HERBS,
  ...SPICES,
  ...UMAMI_BOOSTERS,
  ...STARCHES,
  ...VEGETABLES,
  ...SWEETENERS,
  ...TEXTURE_AGENTS,
];

for (const ingredient of ALL_INGREDIENTS) {
  INGREDIENT_LIBRARY.set(ingredient.id, ingredient);
}

/** Get an ingredient by ID, throwing if not found */
export function getIngredient(id: string): IngredientCard {
  const card = INGREDIENT_LIBRARY.get(id);
  if (!card) {
    throw new Error(`Ingredient not found: ${id}`);
  }
  return card;
}

/** Get all ingredients as an array */
export function getAllIngredients(): IngredientCard[] {
  return Array.from(INGREDIENT_LIBRARY.values());
}
