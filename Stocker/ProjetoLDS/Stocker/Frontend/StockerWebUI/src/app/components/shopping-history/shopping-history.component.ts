import { Component } from '@angular/core';
import { PurchasesService } from '../../services/purchases.service';
import { Purchase } from '../../models/purchase';
import { CommonModule } from '@angular/common';
import { PurchaseProduct } from '../../models/purchaseProduct';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-shopping-history',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './shopping-history.component.html',
  styleUrls: [
    './shopping-history.component.css',
    '../products-type/products-type.component.css',
    '../products/products.component.css',
    '../product-inventory/product-inventory.component.css',
  ],
})
export class ShoppingHistoryComponent {
  purchases: Purchase[] = [];
  currentGroupId: number = localStorage.getItem('selectedGroupId')
    ? parseInt(localStorage.getItem('selectedGroupId')!)
    : 0;
  loading: boolean = true;
  alerts: string[] = [];
  selectedPurchase!: Number;
  selectedPurchaseProducts: PurchaseProduct[] = [];

  constructor(private purchaseService: PurchasesService) {}

  ngOnInit(): void {
    this.purchaseService
      .getHistory(this.currentGroupId)
      .subscribe((purchases) => {
        this.purchases = purchases;
        this.loading = false;
      });
  }

  openPurchase(purchaseId: number) {
    this.selectedPurchase = purchaseId;
    this.purchaseService
      .getPurchaseDetails(purchaseId, this.currentGroupId)
      .subscribe((products) => {
        this.selectedPurchaseProducts = products;
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

  checkOpenPurchase(purchaseId: number) {
    return this.selectedPurchase === purchaseId;
  }

  delete(purchaseId: number) {
    this.purchaseService
      .deletePurchase(purchaseId, this.currentGroupId)
      .subscribe(() => {
        this.purchases = this.purchases.filter((p) => p.id !== purchaseId);
        this.addAlert('Compra eliminada com sucesso!');
      });
  }
}
