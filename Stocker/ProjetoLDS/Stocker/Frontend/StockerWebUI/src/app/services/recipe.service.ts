import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/Recipes/recipe';
import { Observable } from 'rxjs';
import { RecipeCreateDto } from '../models/Recipes/RecipeCreateDto';
import { ProductRecipeDto } from '../models/Recipes/ProductRecipeDto';
import { ProductAddToRecipeDto } from '../models/Recipes/ProductAddToRecipeDto';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all recipes associated with a specific group.
   * @param groupId - The ID of the group to fetch recipes for.
   * @returns An Observable containing a list of recipes.
   */
  getGroupRecipes(groupId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/Recipe/${groupId}/recipes`);
  }

  /**
   * Retrieves all products included in a specific recipe.
   * @param groupId - The ID of the group the recipe belongs to.
   * @param recipeId - The ID of the recipe to fetch products for.
   * @returns An Observable containing a list of products in the recipe.
   */
  getProductsInRecipe(
    groupId: number,
    recipeId: number
  ): Observable<ProductRecipeDto[]> {
    return this.http.get<ProductRecipeDto[]>(
      `${this.apiUrl}/Recipe/${groupId}/recipes/${recipeId}/products`
    );
  }

  /**
   * Updates the name of a specific recipe.
   * @param recipeId - The ID of the recipe to rename.
   * @param recipeName - An object containing the new name for the recipe.
   * @param groupId - The ID of the group the recipe belongs to.
   * @returns An Observable containing the updated recipe.
   */
  changeRecipeName(
    recipeId: number,
    recipeName: RecipeCreateDto,
    groupId: number
  ): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${this.apiUrl}/Recipe/${groupId}/recipes/${recipeId}/edit`,
      recipeName
    );
  }

  /**
   * Removes a specific product from a recipe.
   * @param recipeId - The ID of the recipe.
   * @param productId - The ID of the product to remove.
   * @param groupId - The ID of the group the recipe belongs to.
   * @returns An Observable indicating the result of the operation.
   */
  removeProductFromRecipe(
    recipeId: number,
    productId: number,
    groupId: number
  ): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/Recipe/${groupId}/recipes/${recipeId}?productId=${productId}`
    );
  }

  /**
   * Deletes a specific recipe.
   * @param recipeId - The ID of the recipe to delete.
   * @param groupId - The ID of the group the recipe belongs to.
   * @returns An Observable indicating the result of the operation.
   */
  deleteRecipe(recipeId: number, groupId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/Recipe/${groupId}/recipes/?recipeId=${recipeId}`
    );
  }

  /**
   * Consumes a recipe, typically used to indicate it has been used or prepared.
   * @param recipeId - The ID of the recipe to consume.
   * @param groupId - The ID of the group the recipe belongs to.
   * @returns An Observable indicating the result of the operation.
   */
  consumeRecipe(recipeId: number, groupId: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/Recipe/${groupId}/recipes/${recipeId}/consume`,
      undefined
    );
  }

  /**
   * Creates a new recipe within a specific group.
   * @param groupId - The ID of the group where the recipe will be created.
   * @param recipe - An object containing the name of the new recipe.
   * @returns An Observable indicating the result of the operation.
   */
  createRecipe(
    groupId: number,
    recipe: {
      name: string;
    }
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/Recipe/${groupId}/recipes`, recipe);
  }

  /**
   * Adds a new product to a specific recipe.
   * @param recipeId - The ID of the recipe to add the product to.
   * @param newProduct - The product data to add.
   * @param groupId - The ID of the group the recipe belongs to.
   * @returns An Observable indicating the result of the operation.
   */
  addProductToRecipe(
    recipeId: number,
    newProduct: ProductAddToRecipeDto,
    groupId: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Recipe/${groupId}/recipes/${recipeId}`,
      newProduct
    );
  }

  /**
   * Updates an existing product in a recipe.
   * @param recipeId - The ID of the recipe.
   * @param updatedProduct - The updated product data.
   * @param groupId - The ID of the group the recipe belongs to.
   * @returns An Observable containing the updated recipe.
   */
  editProductInRecipe(
    recipeId: number,
    updatedProduct: ProductAddToRecipeDto,
    groupId: number
  ): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${this.apiUrl}/Recipe/${groupId}/recipes/${recipeId}/editProduct`,
      updatedProduct
    );
  }
}
