import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-product-modal.component.html',
  styleUrls: [
    './add-product-modal.component.css',
    '../product-modal/product-modal.component.css',
    '../products-type/products-type.component.css',
    '../products/products.component.css',
    '../product-inventory/product-inventory.component.css',
  ],
})
export class AddProductModalComponent {
  @Input() products!: Product[];
  @Output() onClose = new EventEmitter<void>();
  @Output() onAdd = new EventEmitter<Product>();

  closeModal(): void {
    this.onClose.emit();
  }

  addProduct(product: Product): void {
    this.onAdd.emit(product);
    this.onClose.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
