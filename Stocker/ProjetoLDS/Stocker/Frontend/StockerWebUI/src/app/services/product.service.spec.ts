import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product';
import { Unity } from '../enums/unity.enum';
import { Types } from '../enums/types.enum';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockProduct: Product = {
    id: 2,
    name: 'Tomato',
    type: Types.Frutas_Verduras,
    unity: Unity.Kilos,
    group_Id: 1,
    quantity: 12,
    order_Point: 1,
    ideal_Point: 20,
    in_List: false,
  };

  const mockProducts: Product[] = [mockProduct];

  describe('getProductsByType', () => {
    it('deve enviar uma requisição GET para obter produtos filtrados por tipo', (done) => {
      const productType = 'Frutas_Verduras';

      service.getProductsByType(productType).subscribe((response) => {
        expect(response).toEqual(mockProducts);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Products?type=${productType}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('createProduct', () => {
    it('deve enviar uma requisição POST para criar um produto associado a um grupo', (done) => {
      const groupId = 1;

      service.createProduct(mockProduct, groupId).subscribe((response) => {
        expect(response).toEqual(mockProduct);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Products/create/${groupId}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockProduct);
    });
  });

  describe('getProductsByGroup', () => {
    it('deve enviar uma requisição GET para obter produtos por grupo', (done) => {
      const groupId = 1;

      service.getProductsByGroup(groupId).subscribe((response) => {
        expect(response).toEqual(mockProducts);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Products/${groupId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('getInventory', () => {
    it('deve enviar uma requisição GET para obter produtos em stock de um grupo', (done) => {
      const groupId = 1;

      service.getInventory(groupId).subscribe((response) => {
        expect(response).toEqual(mockProducts);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Products/inventory/${groupId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('updateProduct', () => {
    it('deve enviar uma requisição PUT para atualizar um produto', (done) => {
      const groupId = 1;
      const productId = 2;

      service
        .updateProduct(groupId, productId, mockProduct)
        .subscribe((response) => {
          expect(response).toEqual(mockProduct);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Products/update/${groupId}/${productId}`
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockProduct);
    });
  });

describe('deleteProduct', () => {
  it('deve enviar uma requisição DELETE para remover um produto', (done) => {
    const groupId = 1;
    const productId = 2;

    service.deleteProduct(groupId, productId).subscribe((response) => {
      expect(response).toBeNull();
      done();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Products/delete/${groupId}/${productId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  }, 10000);

});


  describe('consumeProduct', () => {
    it('deve enviar uma requisição POST para consumir uma quantidade de um produto', (done) => {
      const groupId = 1;
      const productId = 2;
      const quantityToConsume = 5;

      service
        .consumeProduct(productId, groupId, quantityToConsume)
        .subscribe((response) => {
          expect(response).toEqual({ success: true });
          done();
        });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Products/${groupId}/${productId}/consume?quantityToConsume=${quantityToConsume}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush({ success: true });
    });
  });
});
