import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Types } from '../../enums/types.enum';
import { Product } from '../../models/product';
import { jest } from '@jest/globals';
import { Unity } from '../../enums/unity.enum';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProductsByGroup: jest.fn(() => of([])),
      createProduct: jest.fn(() =>
        of({ id: 1, name: 'Test Product', group_Id: 1 })
      ),
      updateProduct: jest.fn(() =>
        of({ id: 1, name: 'Updated Product', group_Id: 1 })
      ),
    };

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue('1'),
        setItem: jest.fn(),
        clear: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    activatedRouteMock = {
      paramMap: of({
        get: (key: string) => {
          if (key === 'type') return Types.Frutas_Verduras;
          return null;
        },
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the product type from route params', () => {
      component.ngOnInit();
      expect(component.productType).toBe(Types.Frutas_Verduras);
    });

    it('should call loadProducts on initialization', () => {
      const loadProductsSpy = jest.spyOn(component, 'loadProducts');
      component.ngOnInit();
      expect(loadProductsSpy).toHaveBeenCalled();
    });
  });

  describe('loadProducts', () => {
    it('should call ProductService.getProductsByGroup with currentGroupId', () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Banana',
          type: Types.Frutas_Verduras,
          unity: Unity.Kilos,
          group_Id: 1,
          quantity: 12,
          order_Point: 1,
          ideal_Point: 20,
          in_List: false,
        },
      ];

      productServiceMock.getProductsByGroup.mockReturnValue(of(mockProducts));

      component.loadProducts();

      // Verificações
      expect(productServiceMock.getProductsByGroup).toHaveBeenCalledWith(1); // Valida a chamada
      expect(component.products).toEqual(mockProducts); // Valida os produtos
      expect(component.loading).toBe(false); // Valida que o carregamento foi concluído
    });

    it('should handle errors gracefully', () => {
      productServiceMock.getProductsByGroup.mockReturnValue(of([]));

      component.currentGroupId = 1;
      component.loadProducts();

      expect(component.products).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('getFilteredProducts', () => {
    it('should filter products based on type and search query', () => {
      component.products = [
        {
          id: 1,
          name: 'Banana',
          type: Types.Frutas_Verduras,
          unity: Unity.Kilos,
          group_Id: 1,
          quantity: 12,
          order_Point: 1,
          ideal_Point: 20,
          in_List: false,
        },
        {
          id: 2,
          name: 'Tomato',
          type: Types.Frutas_Verduras,
          unity: Unity.Kilos,
          group_Id: 1,
          quantity: 12,
          order_Point: 1,
          ideal_Point: 20,
          in_List: false,
        },
        {
          id: 3,
          name: 'Chicken',
          type: Types.Cereais_Graos,
          unity: Unity.Kilos,
          group_Id: 1,
          quantity: 12,
          order_Point: 1,
          ideal_Point: 20,
          in_List: false,
        },
      ];
      component.searchQuery = 'Tom';

      const filtered = component.getFilteredProducts();
      expect(filtered).toEqual([
        {
          id: 2,
          name: 'Tomato',
          type: Types.Frutas_Verduras,
          unity: Unity.Kilos,
          group_Id: 1,
          quantity: 12,
          order_Point: 1,
          ideal_Point: 20,
          in_List: false,
        },
      ]);
    });
  });

  describe('handleCreateProduct', () => {
    it('should add a new product to the list and show an alert', () => {
      const newProduct: Product = {
        id: 1,
        name: 'Test Product',
        type: Types.Frutas_Verduras,
        unity: Unity.Kilos,
        group_Id: 1,
        quantity: 12,
        order_Point: 1,
        ideal_Point: 20,
        in_List: false,
      };
      const addAlertSpy = jest.spyOn(component, 'addAlert');
      productServiceMock.createProduct.mockReturnValue(of(newProduct));

      component.handleCreateProduct(newProduct);

      expect(productServiceMock.createProduct).toHaveBeenCalledWith(
        newProduct,
        1
      );
      expect(component.products).toContain(newProduct);
      expect(addAlertSpy).toHaveBeenCalledWith('Produto criado com sucesso.');
    });
  });

  describe('handleEditProduct', () => {
    it('should update an existing product and show an alert', () => {
      const existingProduct: Product = {
        id: 1,
        name: 'Banana',
        type: Types.Frutas_Verduras,
        unity: Unity.Kilos,
        group_Id: 1,
        quantity: 12,
        order_Point: 1,
        ideal_Point: 20,
        in_List: false,
      };
      component.products = [existingProduct];
      const updatedProduct: Product = {
        id: 1,
        name: 'Updated Banana',
        type: Types.Frutas_Verduras,
        unity: Unity.Kilos,
        group_Id: 1,
        quantity: 12,
        order_Point: 1,
        ideal_Point: 20,
        in_List: false,
      };

      productServiceMock.updateProduct.mockReturnValue(of(updatedProduct));
      component.currentGroupId = 1; // Certifique-se de definir currentGroupId
      component.products = [existingProduct];

      const addAlertSpy = jest.spyOn(component, 'addAlert');
      component.handleEditProduct(updatedProduct);

      expect(productServiceMock.updateProduct).toHaveBeenCalledWith(
        1,
        1,
        updatedProduct
      );
      expect(component.products[0].name).toBe('Updated Banana');
      expect(addAlertSpy).toHaveBeenCalledWith(
        'Produto atualizado com sucesso.'
      );
    });
  });

  describe('handleDeleteProduct', () => {
    it('should remove a product from the list and show an alert', () => {
      const existingProduct: Product = {
        id: 1,
        name: 'Banana',
        type: Types.Frutas_Verduras,
        unity: Unity.Kilos,
        group_Id: 1,
        quantity: 12,
        order_Point: 1,
        ideal_Point: 20,
        in_List: false,
      };
      component.products = [existingProduct];
      const addAlertSpy = jest.spyOn(component, 'addAlert');

      component.handleDeleteProduct(1);

      expect(component.products).not.toContain(existingProduct);
      expect(addAlertSpy).toHaveBeenCalledWith(
        'Produto eliminado com sucesso.'
      );
    });
  });

  describe('addAlert', () => {
    it('should add a new alert and remove it after 2 seconds', fakeAsync(() => {
      jest.useFakeTimers();
      const message = 'Test Alert';

      component.addAlert(message);
      expect(component.alerts).toContain(message);

      jest.advanceTimersByTime(2000);
      expect(component.alerts).not.toContain(message);

      jest.useRealTimers();
    }));
  });
});
