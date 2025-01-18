import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StatisticsService } from './statistics.service';
import { environment } from '../../environments/environment.development';
import { CategoryStats } from '../models/Statistics/CategoryStats';
import { ProductStats } from '../models/Statistics/ProductStats';
import { ExpensesStats } from '../models/Statistics/ExpensesStats';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatisticsService],
    });
    service = TestBed.inject(StatisticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getConsumptionStats', () => {
    it('deve retornar estatísticas de consumo', () => {
      const groupId = 1;
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockData = [{ productId: 1, totalConsumed: 100 }];

      service
        .getConsumptionStats(groupId, startDate, endDate)
        .subscribe((data) => {
          expect(data).toEqual(mockData);
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Statistics/consumption-stats/${groupId}/?startDate=${startDate}&endDate=${endDate}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getCategoryStats', () => {
    it('deve retornar estatísticas por categoria', () => {
      const groupId = 1;
      const productType = 'Food';
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockStats: CategoryStats = { productType: productType, totalSpent: 150, totalPurchases:12, totalQuantity: 10, averageSpent: 6 };

      service
        .getCategoryStats(groupId, productType, startDate, endDate)
        .subscribe((stats) => {
          expect(stats).toEqual(mockStats);
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Statistics/type-statistics/${groupId}/${productType}/?startDate=${startDate}&endDate=${endDate}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('getProductStats', () => {
    it('deve retornar estatísticas de um produto', () => {
      const groupId = 1;
      const productId = 2;
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockStats: ProductStats = {
        totalSpent: 150,
        totalPurchases: 12,
        totalQuantity: 10,
        productId: productId,
        averageSpentByProduct: 3
      };

      service
        .getProductStats(groupId, productId, startDate, endDate)
        .subscribe((stats) => {
          expect(stats).toEqual(mockStats);
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Statistics/product-statistics/${groupId}/${productId}/?startDate=${startDate}&endDate=${endDate}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('getExpensesStats', () => {
    it('deve retornar estatísticas de despesas', () => {
      const groupId = 1;
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockStats: ExpensesStats = {
        totalSpent: 150,
        totalPurchases: 12,
        averageSpent: 6,
      };

      service
        .getExpensesStats(groupId, startDate, endDate)
        .subscribe((stats) => {
          expect(stats).toEqual(mockStats);
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Statistics/total-spent/${groupId}/?startDate=${startDate}&endDate=${endDate}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });
});
