import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseProduct } from '../models/purchaseProduct';
import { Purchase } from '../models/purchase';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the shopping list for a specific group.
   * @param groupId - The ID of the group for which to fetch the shopping list.
   * @returns An Observable containing the shopping list.
   */
  getShoppingList(groupId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Purchases/${groupId}/shoppingList`);
  }

  /**
   * Toggles a product's inclusion in the shopping list for a group.
   * @param productId - The ID of the product to toggle.
   * @param groupId - The ID of the group to which the shopping list belongs.
   * @returns An Observable indicating the result of the operation.
   */
  toggleFromShoppingList(productId: number, groupId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/Purchases/${groupId}/addToList/${productId}`,
      {}
    );
  }

  /**
   * Registers a new purchase for a group.
   * @param purchaseProducts - An array of `PurchaseProduct` representing the products purchased.
   * @param groupId - The ID of the group for which the purchase is being registered.
   * @returns An Observable indicating the result of the operation.
   */
  registerPurchase(
    purchaseProducts: PurchaseProduct[],
    groupId: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Purchases/${groupId}/register`,
      purchaseProducts
    );
  }

  /**
   * Retrieves the purchase history for a group.
   * @param groupId - The ID of the group for which to fetch the purchase history.
   * @returns An Observable containing an array of purchases.
   */
  getHistory(groupId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(
      `${this.apiUrl}/Purchases/${groupId}/history`
    );
  }

  /**
   * Retrieves the details of a specific purchase.
   * @param purchaseId - The ID of the purchase to fetch details for.
   * @param groupId - The ID of the group to which the purchase belongs.
   * @returns An Observable containing an array of products in the purchase.
   */
  getPurchaseDetails(
    purchaseId: number,
    groupId: number
  ): Observable<PurchaseProduct[]> {
    return this.http.get<PurchaseProduct[]>(
      `${this.apiUrl}/Purchases/${groupId}/${purchaseId}/products`
    );
  }

  /**
   * Deletes a specific purchase from a group's history.
   * @param purchaseId - The ID of the purchase to delete.
   * @param groupId - The ID of the group to which the purchase belongs.
   * @returns An Observable indicating the result of the operation.
   */
  deletePurchase(purchaseId: number, groupId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/Purchases/${groupId}/${purchaseId}`
    );
  }
}
