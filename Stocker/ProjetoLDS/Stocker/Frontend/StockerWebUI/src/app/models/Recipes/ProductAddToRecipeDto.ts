/**
 * Interface representing the data structure for adding a product to a recipe.
 */
export interface ProductAddToRecipeDto {
  /**
   * The name of the product to be added to the recipe.
   */
  name: string;

  /**
   * The quantity of the product to be used in the recipe.
   */
  quantity: number;
}
