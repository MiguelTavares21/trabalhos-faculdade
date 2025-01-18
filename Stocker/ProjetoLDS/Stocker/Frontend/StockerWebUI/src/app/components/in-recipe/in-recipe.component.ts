import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Recipe } from '../../models/Recipes/recipe';
import { RecipeService } from '../../services/recipe.service';
import { ProductService } from '../../services/product.service';
import { ProductRecipeDto } from '../../models/Recipes/ProductRecipeDto';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { Product } from '../../models/product';

@Component({
  selector: 'app-in-recipe',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './in-recipe.component.html',
  styleUrls: ['./in-recipe.component.css'],
})
export class InRecipeComponent {
  // Inputs to pass the recipe data and a flag to indicate if it's a new recipe
  @Input() recipe!: Recipe;
  @Input() isNewRecipe: boolean = false;

  // Outputs to notify the parent component about closure
  @Output() close = new EventEmitter<void>();

  // Array to store products currently in the recipe
  productsInRecipe: ProductRecipeDto[] = [];

  // Array to store available products in the group
  productsInGroup: Product[] = [];

  // The ID of the selected group from local storage
  selectedGroupId = localStorage.getItem('selectedGroupId');

  // Toggles for add/edit forms visibility
  addToggle: boolean = false;
  editToggle: boolean = false;

  // Reactive forms for adding and editing products in a recipe
  addProductToRecipe!: FormGroup;
  editProductInRecipe!: FormGroup;

  // Alerts array to display user messages
  alerts: string[] = [];

  // The currently selected product for editing
  selectedProduct: any = null;

  // Local variable to store the updated recipe name
  updatedRecipeName: string = '';

  constructor(
    private recipeService: RecipeService, // Service to interact with recipes
    private productService: ProductService // Service to interact with products
  ) {}

  ngOnInit(): void {
    // Initialize the recipe name
    this.updatedRecipeName = this.recipe.name;

    // Fetch the products associated with the current recipe
    this.fetchProductsInRecipe();

    // Fetch the products available in the selected group
    this.productService
      .getProductsByGroup(Number(this.selectedGroupId))
      .subscribe({
        next: (products) => {
          this.productsInGroup = products;
        },
        error: (error) => {
          console.error('Error loading group products:', error);
        },
      });

    // Set up the reactive forms for adding and editing products
    this.addProductToRecipe = new FormGroup({
      name: new FormControl('', [Validators.required]), // Product name (required)
      quantity: new FormControl('', [
        Validators.required, // Quantity (required)
        Validators.min(0.01), // Minimum value validation
      ]),
    });

    this.editProductInRecipe = new FormGroup({
      name: new FormControl('', [Validators.required]), // Product name (required)
      quantity: new FormControl('', [
        Validators.required, // Quantity (required)
        Validators.min(0.01), // Minimum value validation
      ]),
      unity: new FormControl(''), // Unit field (optional)
    });

    // Automatically update the selected product details when the name is selected
    this.addProductToRecipe
      .get('name')
      ?.valueChanges.subscribe((selectedName) => {
        this.selectedProduct = this.productsInGroup.find(
          (product) => product.name === selectedName
        );
      });
  }

  // Fetches the products associated with the recipe
  fetchProductsInRecipe(): void {
    this.recipeService
      .getProductsInRecipe(Number(this.selectedGroupId), this.recipe.id)
      .subscribe({
        next: (products) => {
          if (products.length === 0) {
            this.productsInRecipe.length = 0; // Clear products if none are found
          }
          this.productsInRecipe = products;
        },
        error: (error) => {
          if (
            error.error.Error[0] ===
            'The recipe does not have any associated products.'
          ) {
            this.productsInRecipe.length = 0;
          }
          console.error('Error loading recipe products:', error);
        },
      });
  }

  // Updates the recipe name
  changeRecipeName(): void {
    this.recipeService
      .changeRecipeName(
        this.recipe.id,
        { Name: this.updatedRecipeName }, // Object containing the updated name
        Number(this.selectedGroupId)
      )
      .subscribe({
        next: () => {
          this.addAlert('Nome da receita atualizado com sucesso.');
        },
        error: (error) => {
          console.error('Error updating recipe name:', error);
          this.addAlert(`${error.error.Error[0]}!`);
        },
      });
  }

  // Adds a product to the recipe
  adicionarProduto(): void {
    if (this.addProductToRecipe.invalid) {
      console.error('Formulário inválido!');
      this.addAlert('Formulário inválido!');
      return;
    }

    const newProduct = this.addProductToRecipe.value;
    console.log('Adding product:', newProduct);

    this.recipeService
      .addProductToRecipe(
        this.recipe.id,
        newProduct,
        Number(this.selectedGroupId)
      )
      .subscribe({
        next: () => {
          this.addAlert('Produto adicionado com sucesso.');
          this.closeAddProductPopup();
          this.fetchProductsInRecipe();
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.addAlert(`${error.error.Error[0]}!`);
        },
      });
  }

  // Edits a product in the recipe
  editarProduto(): void {
    if (this.editProductInRecipe.invalid) {
      console.error('Invalid form');
      this.addAlert('Invalid form!');
      return;
    }

    const updatedProduct = {
      name: this.editProductInRecipe.get('name')?.value,
      quantity: this.editProductInRecipe.get('quantity')?.value,
    };

    this.recipeService
      .editProductInRecipe(
        this.recipe.id,
        updatedProduct,
        Number(this.selectedGroupId)
      )
      .subscribe({
        next: () => {
          console.log('Product edited successfully.');
          this.addAlert('Product edited successfully.');
          this.closeEditProductPopup();
          this.fetchProductsInRecipe();
        },
        error: (error) => {
          console.error('Error editing product:', error);
          this.addAlert(`${error.error.Error[0]}!`);
        },
      });
  }

  // Removes a product from the recipe
  removerProduto(productId: number): void {
    this.recipeService
      .removeProductFromRecipe(
        this.recipe.id,
        productId,
        Number(this.selectedGroupId)
      )
      .subscribe({
        next: () => {
          console.log('Product removed successfully.');
          this.addAlert('Product removed successfully.');
          this.fetchProductsInRecipe();
        },
        error: (error) => {
          console.error('Error removing product:', error);
          this.addAlert(`${error.error.Error[0]}!`);
        },
      });
  }

  // Opens the add product form
  openAddProductPopup(): void {
    this.editToggle = false;
    this.addToggle = true;
  }

  // Closes the add product form
  closeAddProductPopup(): void {
    this.addToggle = false;
  }

  // Opens the edit product form with pre-filled data
  openEditProductPopup(
    productName: string,
    productQuantity: number,
    productUnity: string
  ): void {
    this.editProductInRecipe.patchValue({
      name: productName,
      quantity: productQuantity,
      unity: productUnity,
    });
    this.addToggle = false;
    this.editToggle = true;
  }

  // Closes the edit product form
  closeEditProductPopup(): void {
    this.editToggle = false;
  }

  // Closes the popup and notifies the parent component
  closePopup(): void {
    this.close.emit();
  }

  // Adds an alert message
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
    setTimeout(() => {
      this.removeAlert(message);
    }, 2000); // Removes the alert after 2 seconds
  }

  // Removes an alert message
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }
}
