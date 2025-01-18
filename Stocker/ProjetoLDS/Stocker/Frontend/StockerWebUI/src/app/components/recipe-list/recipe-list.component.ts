import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { ProductService } from '../../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { Recipe } from '../../models/Recipes/recipe';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InRecipeComponent } from '../in-recipe/in-recipe.component';
import { AlertComponent } from '../alert/alert.component';
import { CreateRecipeComponent } from '../create-recipe/create-recipe.component';
import { Product } from '../../models/product';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SideBarComponent,
    RouterModule,
    InRecipeComponent,
    AlertComponent,
    CreateRecipeComponent,
  ],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  // Array to hold all recipes
  recipes: Recipe[] = [];

  // Array to hold filtered recipes based on search criteria
  filteredRecipes: any[] = [];

  // List of alert messages to be displayed to the user
  alerts: string[] = [];

  // Search query entered by the user
  searchQuery: string = '';

  // Recipe selected for viewing or editing
  selectedRecipe: Recipe | null = null;

  // Flags to manage popups visibility
  isPopupOpen: boolean = false;
  isPopupCreateOpen: boolean = false;

  // Current group ID fetched from localStorage
  selectedGroupId = localStorage.getItem('selectedGroupId');

  // The most recently created recipe (used to open popup after creation)
  mostRecentCreatedRecipe = {
    id: 0,
    name: '',
  };

  // Flag to indicate whether the recipe is a new one or existing
  isNewRecipe: boolean = false;

  // List of products (ingredients) available in the current group
  ingredients: Product[] = [];

  // Selected ingredients by the user for filtering recipes
  selectedIngredients: string[] = [];

  // Flag to control the visibility of the ingredient filter panel
  isFilterOpen: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Check if the selected group ID is valid
    if (!this.selectedGroupId || isNaN(Number(this.selectedGroupId))) {
      console.error('Grupo inválido ou não encontrado!');
      return;
    }

    // Fetch recipes and products for the selected group
    this.fetchGroupRecipes();
    this.fetchProductsInGroup();
  }

  // Fetches the recipes for the current group from the RecipeService
  fetchGroupRecipes(): void {
    this.recipeService.getGroupRecipes(Number(this.selectedGroupId)).subscribe({
      next: (recipes) => {
        this.recipes = recipes; // Store the fetched recipes
        this.filteredRecipes = recipes; // Initialize filtered recipes list with all recipes
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
      },
    });
  }

  // Fetches the products (ingredients) for the current group from the ProductService
  fetchProductsInGroup(): void {
    this.productService
      .getProductsByGroup(Number(this.selectedGroupId))
      .subscribe({
        next: (products) => {
          this.ingredients = products; // Store the fetched products (ingredients)
        },
        error: (error) => {
          console.error('Error loading products for the group:', error);
        },
      });
  }

  // Filters recipes based on the search query entered by the user
  filterRecipes(): void {
    const query = this.searchQuery.toLowerCase().trim(); // Normalize the query for case-insensitive comparison
    this.filteredRecipes = this.recipes.filter(
      (recipe) => recipe.name.toLowerCase().includes(query) // Filter recipes by name
    );
  }

  // Filters recipes by the selected ingredients
  filterRecipesByIngredients(): void {
    if (this.selectedIngredients.length === 0) {
      // If no ingredients are selected, reset to show all recipes
      this.filteredRecipes = this.recipes;
      return;
    }

    // Reset the filtered recipes list
    this.filteredRecipes = [];

    // Check each recipe if it contains all selected ingredients
    this.recipes.forEach((recipe) => {
      this.recipeService
        .getProductsInRecipe(Number(this.selectedGroupId), recipe.id)
        .subscribe({
          next: (products) => {
            const hasAllIngredients = this.selectedIngredients.every(
              (ingredient) =>
                products.some((product) => product.name === ingredient) // Check if all selected ingredients are in the recipe
            );
            if (hasAllIngredients) {
              this.filteredRecipes.push(recipe); // Add recipe to filtered list if it matches the criteria
            }
          },
          error: (error) => {
            console.error(
              `Error fetching products for recipe ${recipe.name}:`,
              error
            );
          },
        });
    });
  }

  // Toggles the visibility of the ingredient filter panel
  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  // Opens the popup to view or edit a recipe
  openPopup(recipe: Recipe, isNewRecipe: boolean): void {
    this.selectedRecipe = { ...recipe }; // Copy the recipe to avoid mutation
    this.isNewRecipe = isNewRecipe; // Determine if it's a new or existing recipe
    this.isPopupOpen = true; // Show the popup
  }

  // Closes the recipe popup and refreshes the recipe list
  closePopup(): void {
    this.isPopupOpen = false; // Hide the popup
    this.selectedRecipe = null; // Reset selected recipe
    this.isNewRecipe = false; // Reset the new recipe flag
    this.fetchGroupRecipes(); // Refresh the list of recipes
  }

  // Opens the popup to create a new recipe
  openCreatePopup(): void {
    this.isNewRecipe = true; // Set the flag to indicate new recipe creation
    this.isPopupCreateOpen = true; // Show the create recipe popup
  }

  // Closes the create recipe popup and refreshes the recipe list
  closeCreatePopup(recipe: any): void {
    this.isPopupCreateOpen = false; // Hide the create recipe popup
    this.isNewRecipe = true; // Set the new recipe flag
    this.mostRecentCreatedRecipe = {
      id: recipe.id, // Store the most recent created recipe
      name: recipe.name,
    };
    this.fetchGroupRecipes(); // Refresh the list of recipes
    this.openPopup(this.mostRecentCreatedRecipe, this.isNewRecipe); // Open the popup for the most recent created recipe
  }

  // Deletes a recipe by calling the RecipeService
  deleteRecipe(recipeId: number) {
    this.recipeService
      .deleteRecipe(recipeId, Number(this.selectedGroupId))
      .subscribe({
        next: (response) => {
          this.recipes = this.recipes.filter(
            (recipe) => recipe.id !== recipeId // Remove the deleted recipe from the list
          );
          this.filteredRecipes = this.filteredRecipes.filter(
            (recipe) => recipe.id !== recipeId // Remove the deleted recipe from the filtered list
          );
          this.addAlert('Receita removida com sucesso.');
        },
        error: (error) => {
          console.error('Error deleting recipe:', error);
          this.addAlert(`${error.error.Error[0]}!`); // Show error message
        },
      });
  }

  // Marks a recipe as consumed by calling the RecipeService
  consumeRecipe(recipeId: number) {
    this.recipeService
      .consumeRecipe(recipeId, Number(this.selectedGroupId))
      .subscribe({
        next: (response) => {
          this.addAlert('Receita consumida.');
        },
        error: (error) => {
          console.error('Error consuming recipe:', error);
          this.addAlert(`${error.error.Error[0]}!`); // Show error message
        },
      });
  }

  // Adds an alert message to be shown to the user
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message); // Add the alert if it doesn't already exist
    }
    // Automatically remove the alert after 2 seconds
    setTimeout(() => {
      this.removeAlert(message);
    }, 2000);
  }

  // Removes an alert from the list
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }
}
