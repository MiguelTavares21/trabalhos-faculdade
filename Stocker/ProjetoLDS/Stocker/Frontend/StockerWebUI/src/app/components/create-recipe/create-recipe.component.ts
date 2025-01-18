import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css',
})
export class CreateRecipeComponent {
  // Form for creating a new recipe
  createRecipeForm!: FormGroup;

  // Array to store alert messages
  alerts: string[] = [];

  // The ID of the selected group stored in localStorage
  selectedGroupId = localStorage.getItem('selectedGroupId');

  // Event emitter to notify the parent component when the popup is closed or data is returned
  @Output() close = new EventEmitter<any>();

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    // Initialize the form for creating a recipe with validation
    this.createRecipeForm = new FormGroup({
      name: new FormControl('', [
        Validators.required, // Recipe name is required
        Validators.maxLength(100), // Maximum length of the recipe name is 100 characters
      ]),
    });
  }

  // Method to handle recipe creation
  onCreateRecipe(): void {
    // Check if the form is valid
    if (this.createRecipeForm.valid) {
      const recipeDetails = this.createRecipeForm.value;

      // Call the RecipeService to create the recipe and subscribe to the response
      this.recipeService
        .createRecipe(Number(this.selectedGroupId), recipeDetails)
        .subscribe({
          next: (response) => {
            // Show success alert if recipe is created successfully
            this.addAlert(`Receita criada com sucesso.`);
            this.closePopupWithData(response); // Emit the created recipe data
          },
          error: (error) => {
            // Show error alert if recipe creation fails
            this.addAlert(`${error.error.Error[0]}!`);
          },
        });
    } else {
      // Show alert if the form is invalid
      this.addAlert('Por favor, preencha todos os campos obrigatórios!');
    }
  }

  // Method to add an alert message
  addAlert(message: string) {
    // Prevent duplicate alerts
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
  }

  // Method to remove an alert message
  removeAlert(alert: string) {
    // Remove the specific alert from the array
    this.alerts = this.alerts.filter((a) => a !== alert);
  }

  // Method to close the popup and pass the created recipe data
  closePopupWithData(recipe: any): void {
    this.close.emit(recipe);
  }

  // Method to close the popup without passing data
  closePopup(): void {
    this.close.emit(null);
  }
}
