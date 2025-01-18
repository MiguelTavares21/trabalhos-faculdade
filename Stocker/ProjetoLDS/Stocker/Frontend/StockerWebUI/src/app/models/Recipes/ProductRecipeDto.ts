import { Unity } from '../../enums/unity.enum';

/**
 * Interface representing the structure of a product included in a recipe.
 */
export interface ProductRecipeDto {
  /**
   * The name of the product used in the recipe.
   */
  name: string;

  /**
   * The quantity of the product used in the recipe.
   */
  quantity: number;

  /**
   * The unique identifier for the product.
   */
  productId: number;

  /**
   * The unique identifier for the recipe that the product is part of.
   */
  recipeId: number;

  /**
   * The unit of measurement for the product (e.g., grams, liters).
   */
  unity: Unity;
}
