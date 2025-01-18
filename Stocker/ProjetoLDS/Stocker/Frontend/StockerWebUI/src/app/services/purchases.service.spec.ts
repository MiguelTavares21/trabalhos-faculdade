import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PurchasesService } from './purchases.service';
import { environment } from '../../environments/environment.development';
import { PurchaseProduct } from '../models/purchaseProduct';
import { Purchase } from '../models/purchase';
import { Unity } from '../enums/unity.enum';

describe('PurchasesService', () => {
  let service: PurchasesService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PurchasesService],
    });
    service = TestBed.inject(PurchasesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getShoppingList', () => {
    it('deve retornar a lista de compras do grupo', () => {
      const groupId = 1;
      const mockShoppingList = [{ id: 1, name: 'Apple', quantity: 10 }];

      service.getShoppingList(groupId).subscribe((shoppingList) => {
        expect(shoppingList).toEqual(mockShoppingList);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/Purchases/${groupId}/shoppingList`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockShoppingList);
    });
  });

  describe('toggleFromShoppingList', () => {
    it('deve alternar a presença de um produto na lista de compras', () => {
      const productId = 1;
      const groupId = 1;

      service
        .toggleFromShoppingList(productId, groupId)
        .subscribe((response) => {
          expect(response).toBeDefined();
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Purchases/${groupId}/addToList/${productId}`
      );
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });

  describe('registerPurchase', () => {
    it('deve registrar uma compra para o grupo', () => {
      const groupId = 1;
      const mockPurchaseProducts: PurchaseProduct[] = [
        { product_Id: 1, quantity: 5, name: 'produto1', price:12, unity: Unity.Gramas },
        { product_Id: 2, quantity: 10, name: 'produto2', price:12, unity: Unity.Kilos },
      ];

      service
        .registerPurchase(mockPurchaseProducts, groupId)
        .subscribe((response) => {
          expect(response).toBeDefined();
        });

      const req = httpMock.expectOne(`${apiUrl}/Purchases/${groupId}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPurchaseProducts);
      req.flush({});
    });
  });

  describe('getHistory', () => {
    it('deve retornar o histórico de compras do grupo', () => {
      const groupId = 1;
      const mockHistory: Purchase[] = [
        { id: 1, date: '2023-01-01', price: 100, group_Id: 1 },
        { id: 2, date: '2023-01-02', price: 200, group_Id: 1 },
      ];

      service.getHistory(groupId).subscribe((history) => {
        expect(history).toEqual(mockHistory);
      });

      const req = httpMock.expectOne(`${apiUrl}/Purchases/${groupId}/history`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHistory);
    });
  });

  describe('getPurchaseDetails', () => {
    it('deve retornar os detalhes de uma compra específica', () => {
      const groupId = 1;
      const purchaseId = 2;
      const mockPurchaseDetails: PurchaseProduct[] = [
        {
          product_Id: 1,
          quantity: 5,
          name: 'produto1',
          price: 12,
          unity: Unity.Gramas,
        },
        {
          product_Id: 2,
          quantity: 10,
          name: 'produto2',
          price: 12,
          unity: Unity.Kilos,
        },
      ];

      service.getPurchaseDetails(purchaseId, groupId).subscribe((details) => {
        expect(details).toEqual(mockPurchaseDetails);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/Purchases/${groupId}/${purchaseId}/products`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPurchaseDetails);
    });
  });

  describe('deletePurchase', () => {
    it('deve enviar uma requisição DELETE para remover uma compra', () => {
      const groupId = 1;
      const purchaseId = 2;

      service.deletePurchase(purchaseId, groupId).subscribe((response) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(
        `${apiUrl}/Purchases/${groupId}/${purchaseId}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
