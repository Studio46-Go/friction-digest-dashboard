/**
 * @studio46/mfp-data
 *
 * MFP Data - Ingredient libraries and cuisine style targets
 * Part of the Mathematical Flavor Profile Architecture
 */

export {
  INGREDIENT_LIBRARY,
  getIngredient,
  getAllIngredients,
} from "./ingredients/ingredient-library.js";

export {
  STYLE_TARGETS,
  getStyleTarget,
  getStyleTargetIds,
  type StyleTarget,
} from "./ingredients/style-targets.js";

export {
  AA_INGREDIENT_LIBRARY,
  registerAAIngredients,
  countByAATag,
  getByRegion,
} from "./ingredients/aa-ingredient-library.js";
