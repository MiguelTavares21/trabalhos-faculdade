import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryStats } from '../models/Statistics/CategoryStats';
import { ProductStats } from '../models/Statistics/ProductStats';
import { ExpensesStats } from '../models/Statistics/ExpensesStats';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves consumption statistics for a group within a date range.
   * @param groupId - The ID of the group for which to fetch consumption stats.
   * @param startDate - The start date of the period in the format 'YYYY-MM-DD'.
   * @param endDate - The end date of the period in the format 'YYYY-MM-DD'.
   * @returns An Observable containing an array of consumption statistics.
   */
  getConsumptionStats(
    groupId: number,
    startDate: string,
    endDate: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/Statistics/consumption-stats/${groupId}/?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Retrieves category statistics for a group within a date range.
   * @param groupId - The ID of the group for which to fetch category stats.
   * @param productType - The type of product to filter statistics by.
   * @param startDate - The start date of the period in the format 'YYYY-MM-DD'.
   * @param endDate - The end date of the period in the format 'YYYY-MM-DD'.
   * @returns An Observable containing category statistics.
   */
  getCategoryStats(
    groupId: number,
    productType: String,
    startDate: string,
    endDate: string
  ): Observable<CategoryStats> {
    return this.http.get<CategoryStats>(
      `${this.apiUrl}/Statistics/type-statistics/${groupId}/${productType}/?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Retrieves statistics for a specific product within a date range.
   * @param groupId - The ID of the group for which to fetch product stats.
   * @param productId - The ID of the product to filter statistics by.
   * @param startDate - The start date of the period in the format 'YYYY-MM-DD'.
   * @param endDate - The end date of the period in the format 'YYYY-MM-DD'.
   * @returns An Observable containing product statistics.
   */
  getProductStats(
    groupId: number,
    productId: number,
    startDate: string,
    endDate: string
  ): Observable<ProductStats> {
    return this.http.get<ProductStats>(
      `${this.apiUrl}/Statistics/product-statistics/${groupId}/${productId}/?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Retrieves total expenses statistics for a group within a date range.
   * @param groupId - The ID of the group for which to fetch expense stats.
   * @param startDate - The start date of the period in the format 'YYYY-MM-DD'.
   * @param endDate - The end date of the period in the format 'YYYY-MM-DD'.
   * @returns An Observable containing total expense statistics.
   */
  getExpensesStats(
    groupId: number,
    startDate: string,
    endDate: string
  ): Observable<ExpensesStats> {
    return this.http.get<ExpensesStats>(
      `${this.apiUrl}/Statistics/total-spent/${groupId}/?startDate=${startDate}&endDate=${endDate}`
    );
  }
}
