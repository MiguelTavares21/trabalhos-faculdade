import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl; // URL da API

  constructor(private http: HttpClient) {}

  /**
   * Obtém produtos com base no tipo fornecido.
   * @param productType Tipo do produto (ex.: "Frutas_Verduras").
   * @returns Observable contendo uma lista de produtos filtrados pelo tipo.
   */
  getProductsByType(productType: string): Observable<Product[]> {
    const url = `${this.apiUrl}/Products`;
    const params = new HttpParams().set('type', productType);
    return this.http.get<Product[]>(url, { params });
  }

  /**
   * Cria um novo produto e o associa a um grupo.
   * @param product Dados do produto a ser criado.
   * @param groupId ID do grupo ao qual o produto pertence.
   * @returns Observable contendo a resposta da API.
   */
  createProduct(product: Product, groupId: number): Observable<any> {
    const url = `${this.apiUrl}/Products/create/${groupId}`;
    return this.http.post(url, product);
  }

  /**
   * Obtém a lista de produtos associados a um grupo.
   * @param groupId ID do grupo ao qual os produtos pertencem.
   * @returns Observable contendo a lista de produtos do grupo.
   */
  getProductsByGroup(groupId: number): Observable<Product[]> {
    const url = `${this.apiUrl}/Products/${groupId}`;
    return this.http.get<Product[]>(url);
  }

  /**
   * Obtém a lista de produtos em stock de um grupo.
   * @param groupId ID do grupo ao qual os produtos pertencem.
   * @returns Observable contendo a lista de produtos em stock do grupo.
   */
  getInventory(groupId: number): Observable<Product[]> {
    const url = `${this.apiUrl}/Products/inventory/${groupId}`;
    return this.http.get<Product[]>(url);
  }

  /**
   * Atualiza os dados de um produto existente.
   * @param groupId ID do grupo ao qual o produto pertence.
   * @param id ID do produto a ser atualizado.
   * @param product Objeto contendo os novos dados do produto.
   * @returns Observable contendo a resposta da API.
   */
  updateProduct(
    groupId: number,
    id: number,
    product: Product
  ): Observable<any> {
    const url = `${this.apiUrl}/Products/update/${groupId}/${id}`;
    return this.http.put<any>(url, product);
  }

  /**
   * Remove um produto específico.
   * @param groupId ID do grupo ao qual o produto pertence.
   * @param id ID do produto a ser deletado.
   * @returns Observable vazio que indica o sucesso ou falha da operação.
   */
  deleteProduct(groupId: number, id: number): Observable<void> {
    const url = `${this.apiUrl}/Products/delete/${groupId}/${id}`;
    return this.http.delete<void>(url);
  }

  /**
   * Consome uma quantidade especificada de um produto dentro de um grupo.
   * @param productId ID do produto a ser consumido.
   * @param groupId ID do grupo ao qual o produto pertence.
   * @param quantityToConsume Quantidade do produto a ser consumida.
   * @returns Observable contendo a resposta da API.
   */
  consumeProduct(
    productId: number,
    groupId: number,
    quantityToConsume: number
  ): Observable<any> {
    const url = `${this.apiUrl}/Products/${groupId}/${productId}/consume`;
    const params = new HttpParams().set(
      'quantityToConsume',
      quantityToConsume.toString()
    );
    return this.http.post<any>(url, null, { params });
  }
}
