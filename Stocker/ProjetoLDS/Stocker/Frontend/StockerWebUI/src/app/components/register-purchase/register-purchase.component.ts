import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { AlertComponent } from '../alert/alert.component';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';
import { PurchaseProduct } from '../../models/purchaseProduct';
import { Unity } from '../../enums/unity.enum';
import { PurchasesService } from '../../services/purchases.service';

@Component({
  selector: 'app-register-purchase',
  standalone: true,
  imports: [
    CommonModule,
    AddProductModalComponent,
    ProductModalComponent,
    AlertComponent,
    FormsModule,
    ProductModalComponent,
    PurchaseModalComponent,
  ],
  templateUrl: './register-purchase.component.html',
  styleUrls: [
    './register-purchase.component.css',
    '../shopping-list/shopping-list.component.css',
    '../products-type/products-type.component.css',
    '../products/products.component.css',
    '../product-inventory/product-inventory.component.css',
  ],
})
export class RegisterPurchaseComponent {
  /**
   * List of alerts to show on the UI.
   */
  alerts: string[] = [];

  /**
   * Flags to control modal visibility for different operations.
   */
  isModalOpen: boolean = false;
  isCreateModalOpen: boolean = false;
  isPurchaseModalOpen: boolean = false;

  /**
   * List of products added to the purchase.
   */
  products: PurchaseProduct[] = [];

  /**
   * All available products for selection.
   */
  allProducts: Product[] = [];

  /**
   * Currently selected product for purchase.
   */
  selectedProduct: Product | null = null;

  /**
   * Current group ID retrieved from localStorage.
   */
  currentGroupId: number = localStorage.getItem('selectedGroupId')
    ? parseInt(localStorage.getItem('selectedGroupId')!)
    : 0;

  /**
   * Constructor that injects the necessary services.
   * @param productsService - Service to manage products.
   * @param purchaseService - Service to manage purchases.
   */
  constructor(
    private productsService: ProductService,
    private purchaseService: PurchasesService
  ) {}

  /**
   * Adds an alert message to the list.
   * @param message - The alert message to be added.
   */
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
  }

  /**
   * Removes a specific alert from the list.
   * @param alert - The alert message to be removed.
   */
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }

  /**
   * Adds a selected product to the purchase list and opens the purchase modal.
   * @param product - The product to be added to the list.
   */
  addProductToList(product: Product) {
    this.selectedProduct = product;
    this.isPurchaseModalOpen = true;
  }

  /**
   * Closes the product selection modal.
   */
  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Opens the product selection modal and fetches products for the current group.
   */
  openModal(): void {
    var groupId = localStorage.getItem('selectedGroupId');
    if (groupId == null) {
      return;
    }
    this.productsService.getProductsByGroup(parseInt(groupId)).subscribe({
      next: (response) => {
        this.allProducts = response.filter(
          (product) => !this.products.some((p) => p.product_Id === product.id)
        );
        this.isModalOpen = true;
      },
      error: (error) => {
        return;
      },
    });
  }

  /**
   * Opens the create product modal.
   * @param product - Optionally, a product to be edited.
   */
  openCreateModal(product?: Product): void {
    this.isCreateModalOpen = true;
  }

  /**
   * Closes the create product modal.
   */
  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  /**
   * Opens the purchase modal for the selected product.
   * @param product - Optionally, a product for the purchase modal.
   */
  openPurchaseModal(product?: Product): void {
    this.isPurchaseModalOpen = true;
  }

  /**
   * Closes the purchase modal.
   */
  closePurchaseModal(): void {
    this.isPurchaseModalOpen = false;
  }

  /**
   * Handles the creation of a new product.
   * @param product - The new product to be created.
   */
  handleCreateProduct(product: Product): void {
    product.quantity = 0;
    this.productsService.createProduct(product, product.group_Id).subscribe({
      next: (newProduct) => {
        this.isCreateModalOpen = false;
        this.isPurchaseModalOpen = true;
        this.selectedProduct = newProduct;
      },
      error: (error) => {
        return;
      },
    });
  }

  /**
   * Handles the purchase details (price and quantity) and adds the product to the purchase list.
   * @param event - The purchase event containing the price and quantity.
   */
  handlePurchase(event: { price: number; quantity: number }): void {
    const { price, quantity } = event;

    const purchaseProduct = {
      name: this.selectedProduct!.name,
      product_Id: this.selectedProduct!.id,
      unity: this.selectedProduct!.unity,
      price,
      quantity,
    };

    this.products.push(purchaseProduct);
    this.isPurchaseModalOpen = false;
  }

  /**
   * Saves the list of products as a purchase using the purchase service.
   */
  savePurchase(): void {
    this.purchaseService
      .registerPurchase(this.products, this.currentGroupId)
      .subscribe({
        next: (response) => {
          this.addAlert('Compra registrada com sucesso.');
          this.products = []; // Clears the product list after successful purchase.
        },
        error: (error) => {
          this.addAlert('Erro ao registrar compra.');
          return;
        },
      });
  }

  /**
   * Removes a product from the purchase list.
   * @param productId - The ID of the product to remove.
   */
  removeFromList(productId: number) {
    this.products = this.products.filter(
      (product) => product.product_Id !== productId
    );
  }
}
