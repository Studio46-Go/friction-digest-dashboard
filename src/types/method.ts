/**
 * MFP v1.1 - Method & Heat Model (Section 1.4)
 */

/** Cooking method identifiers */
export enum CookingMethod {
  HIGH_HEAT_SEAR = "HIGH_HEAT_SEAR",
  BRAISE = "BRAISE",
  RAW_FINISH = "RAW_FINISH",
  ROAST = "ROAST",
  STEAM = "STEAM",
  DEEP_FRY = "DEEP_FRY",
  SAUTE = "SAUTE",
  SIMMER = "SIMMER",
  GRILL = "GRILL",
  SMOKE_METHOD = "SMOKE_METHOD",
  BLOOM_IN_FAT = "BLOOM_IN_FAT",
  RAW = "RAW",
}

/** Dish type for structural role gating */
export enum DishType {
  COMPLETE_PLATE = "COMPLETE_PLATE",
  SNACK = "SNACK",
  SAUCE = "SAUCE",
  SIDE = "SIDE",
  SOUP = "SOUP",
  SALAD = "SALAD",
  DESSERT = "DESSERT",
}
