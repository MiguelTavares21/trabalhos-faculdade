import { Component, OnInit } from '@angular/core';
import { PurchasesService } from '../../services/purchases.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { ProductService } from '../../services/product.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AddProductModalComponent,
    AlertComponent,
  ],
  templateUrl: './shopping-list.component.html',
  styleUrls: [
    './shopping-list.component.css',
    '../products-type/products-type.component.css',
    '../products/products.component.css',
    '../product-inventory/product-inventory.component.css',
  ],
})
export class ShoppingListComponent implements OnInit {
  shoppingList: Product[] = [];
  products: Product[] = [];
  alerts: string[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  isModalOpen: boolean = false;

  constructor(
    private purchasesService: PurchasesService,
    private productsService: ProductService
  ) {}

  ngOnInit() {
    var groupId = localStorage.getItem('selectedGroupId');
    if (groupId == null) {
      return;
    }

    var id = parseInt(groupId);

    this.purchasesService.getShoppingList(id).subscribe({
      next: (response) => {
        this.shoppingList = response;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
  }

  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }

  getFilteredProducts() {
    return this.shoppingList
      .filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.unity.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  removeFromList(product: Product) {
    var groupId = localStorage.getItem('selectedGroupId');
    if (groupId == null) {
      return;
    }

    this.purchasesService
      .toggleFromShoppingList(product.id, parseInt(groupId))
      .subscribe({
        next: (response) => {
          this.shoppingList = this.shoppingList.filter(
            (p) => p.id !== product.id
          );
        },
        error: (error) => {
          this.addAlert('Error removing product from list.');
        },
      });
  }

  addProductToList(product: Product) {
    var groupId = localStorage.getItem('selectedGroupId');
    if (groupId == null) {
      return;
    }
    this.purchasesService
      .toggleFromShoppingList(product.id, parseInt(groupId))
      .subscribe({
        next: (response) => {
          location.reload();
        },
        error: (error) => {
          this.addAlert(error.error.Error[0]);
        },
      });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  openModal(): void {
    var groupId = localStorage.getItem('selectedGroupId');
    if (groupId == null) {
      return;
    }
    this.productsService.getProductsByGroup(parseInt(groupId)).subscribe({
      next: (response) => {
        this.products = response.filter((product) => !product.in_List);
        this.isModalOpen = true;
      },
      error: (error) => {
        return;
      },
    });
  }
}
