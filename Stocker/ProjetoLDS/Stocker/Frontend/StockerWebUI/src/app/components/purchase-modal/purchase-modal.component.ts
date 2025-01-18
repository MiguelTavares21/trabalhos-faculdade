import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../models/product';

@Component({
  selector: 'app-purchase-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchase-modal.component.html',
  styleUrls: [
    './purchase-modal.component.css',
    '../product-modal/product-modal.component.css',
  ],
})
export class PurchaseModalComponent {
  // Output event emitters to notify parent components
  @Output() onSave = new EventEmitter<any>(); // Emits when saving the purchase data
  @Output() onClose = new EventEmitter<void>(); // Emits when closing the modal without saving

  // The form group that will hold the purchase form controls
  createProductForm!: FormGroup;

  ngOnInit(): void {
    // Initialize the form group with controls for price and quantity
    this.createProductForm = new FormGroup({
      price: new FormControl(0, [Validators.min(0)]), // Price should be greater than or equal to 0
      quantity: new FormControl(0, [Validators.min(0.01)]), // Quantity should be greater than 0.01
    });
  }

  // This method is triggered when the form is submitted
  onSubmit(): void {
    const isFormValid = this.createProductForm.valid; // Check if the form is valid

    // Validate the form and proceed only if it's valid
    if (isFormValid) {
      // Emit the price and quantity values to the parent component
      this.onSave.emit({
        price: this.createProductForm.value.price,
        quantity: this.createProductForm.value.quantity,
      });
    } else {
      // Log an error if the form is invalid
      console.error('Form is invalid or price is not defined correctly.');
    }
  }

  // This method is triggered when the modal is closed
  closeModal() {
    // Reset the form values to their initial state
    this.createProductForm.reset();
    // Emit an event to notify the parent component that the modal is closed
    this.onClose.emit();
  }
}
