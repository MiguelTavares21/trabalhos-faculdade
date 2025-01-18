import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { StatisticsComponent } from './statistics.component';
import { StatisticsService } from '../../services/statistics.service';
import { ProductService } from '../../services/product.service';
import { jest } from '@jest/globals';
import { Unity } from '../../enums/unity.enum';
import { Types } from '../../enums/types.enum';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let statsServiceMock: any;
  let productServiceMock: any;

  beforeEach(async () => {
    statsServiceMock = {
      getCategoryStats: jest.fn().mockReturnValue(of(null)),
      getProductStats: jest.fn().mockReturnValue(of(null)),
      getExpensesStats: jest
        .fn()
        .mockReturnValue(
          of({ totalSpent: 0, totalPurchases: 0, averageSpent: 0 })
        ),
      getConsumptionStats: jest.fn().mockReturnValue(of([])),
    };

    productServiceMock = {
      getProductsByGroup: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
      providers: [
        { provide: StatisticsService, useValue: statsServiceMock },
        { provide: ProductService, useValue: productServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;

    component.consumptionChartCanvasRef = {
      nativeElement: document.createElement('canvas'),
    } as any;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve chamar os métodos de busca ao inicializar', () => {
      const fetchExpensesSpy = jest.spyOn(component, 'fetchExpensesStatsData');
      const fetchTypeSpy = jest.spyOn(component, 'fetchTypeStatsData');
      const fetchProductsSpy = jest.spyOn(component, 'fetchProductsByGroup');

      component.ngOnInit();

      expect(fetchExpensesSpy).toHaveBeenCalled();
      expect(fetchTypeSpy).toHaveBeenCalled();
      expect(fetchProductsSpy).toHaveBeenCalled();
    });
  });

  describe('fetchExpensesStatsData', () => {
    it('deve atualizar expensesData com os dados retornados pelo serviço', () => {
      const mockData = { totalSpent: 100, totalPurchases: 5, averageSpent: 20 };
      statsServiceMock.getExpensesStats.mockReturnValue(of(mockData));

      component.fetchExpensesStatsData();

      expect(component.expensesData).toEqual(mockData);
    });

    it('deve lidar com erros e definir valores padrão', () => {
      statsServiceMock.getExpensesStats.mockReturnValue(
        throwError(() => new Error('Erro'))
      );

      component.fetchExpensesStatsData();

      expect(component.expensesData).toEqual({
        totalSpent: 0,
        totalPurchases: 0,
        averageSpent: 0,
      });
    });
  });

  describe('fetchProductsByGroup', () => {
    it('deve atualizar a lista de produtos', () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          group_Id: 1,
          quantity: 10,
          ideal_Point: 1,
          unity: Unity.Gramas,
          order_Point: 20,
          type: Types.Carne_Peixe,
          in_List: false,
        },
      ];
      productServiceMock.getProductsByGroup.mockReturnValue(of(mockProducts));

      component.fetchProductsByGroup();

      expect(component.products).toEqual(mockProducts);
    });

    it('deve lidar com erros ao buscar os produtos', () => {
      productServiceMock.getProductsByGroup.mockReturnValue(
        throwError(() => new Error('Erro'))
      );

      component.fetchProductsByGroup();

      expect(component.products).toEqual([]);
    });
  });

  describe('fetchTypeStatsData', () => {
    it('deve atualizar categoryData com os dados retornados pelo serviço', () => {
      const mockData = {
        productType: 'Congelados',
        totalSpent: 200,
        totalQuantity: 10,
        totalPurchases: 2,
        averageSpent: 100,
      };
      statsServiceMock.getCategoryStats.mockReturnValue(of(mockData));

      component.fetchTypeStatsData();

      expect(component.categoryData).toEqual(mockData);
    });

    it('deve lidar com erros e definir valores padrão', () => {
      statsServiceMock.getCategoryStats.mockReturnValue(
        throwError(() => new Error('Erro'))
      );

      component.fetchTypeStatsData();

      expect(component.categoryData).toEqual({
        productType: '',
        totalSpent: 0,
        totalQuantity: 0,
        totalPurchases: 0,
        averageSpent: 0,
      });
    });
  });

  describe('updateConsumptionChart', () => {
    it('deve criar um gráfico com os dados retornados pelo serviço', () => {
      const mockData = [
        { productName: 'Produto 1', totalConsumed: 50 },
        { productName: 'Produto 2', totalConsumed: 30 },
      ];
      statsServiceMock.getConsumptionStats.mockReturnValue(of(mockData));

      component.updateConsumptionChart();

      expect(component.consumptionLabelData).toEqual([
        'Produto 1',
        'Produto 2',
      ]);
      expect(component.totalConsumptionConsumedData).toEqual([50, 30]);
    });

    it('deve lidar com erros e exibir um alerta', () => {
      statsServiceMock.getConsumptionStats.mockReturnValue(
        throwError(() => new Error('Erro'))
      );

      component.updateConsumptionChart();

      expect(component.alerts).toContain(
        'Sem dados disponíveis para o intervalo selecionado!'
      );
    });
  });
});
