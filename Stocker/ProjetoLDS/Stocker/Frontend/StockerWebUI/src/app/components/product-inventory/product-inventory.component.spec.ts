import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductInventoryComponent } from './product-inventory.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product';
import { Types } from '../../enums/types.enum';
import { Unity } from '../../enums/unity.enum';
import { jest } from '@jest/globals';

describe('ProductInventoryComponent', () => {
  let component: ProductInventoryComponent;
  let fixture: ComponentFixture<ProductInventoryComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockActivatedRoute: any;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Ração',
      unity: Unity.Gramas,
      quantity: 10,
      group_Id: 1,
      order_Point: 1,
      ideal_Point: 3,
      type: Types.Animais,
      in_List: false,
    },
    {
      id: 2,
      name: 'Banana',
      unity: Unity.Kilos,
      quantity: 2,
      group_Id: 1,
      order_Point: 2,
      ideal_Point: 4,
      type: Types.Frutas_Verduras,
      in_List: false,
    },
  ];

  beforeEach(async () => {
    mockProductService = {
      getInventory: jest.fn().mockReturnValue(of(mockProducts)),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      consumeProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    mockActivatedRoute = { snapshot: { params: { id: '1' } } };

    await TestBed.configureTestingModule({
      imports: [ProductInventoryComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load current group ID and products', () => {
      jest.spyOn(component as any, 'getCurrentGroupId').mockReturnValue(1);
      jest.spyOn(component, 'loadProducts').mockImplementation(() => {});

      component.ngOnInit();

      expect(component['getCurrentGroupId']).toHaveBeenCalled();
      expect(component.loadProducts).toHaveBeenCalled();
    });
  });

  describe('getCurrentGroupId', () => {
    it('should return the current group ID from localStorage', () => {
      localStorage.setItem('selectedGroupId', '2');

      const result = (component as any).getCurrentGroupId();

      expect(result).toBe(2);
    });

    it('should return 0 if no group ID is found', () => {
      localStorage.removeItem('selectedGroupId');
      const result = (component as any).getCurrentGroupId();
      expect(result).toBe(0);
    });
  });

  describe('loadProducts', () => {
    it('should load products for the current group', () => {
      jest.spyOn(component as any, 'getCurrentGroupId').mockReturnValue(1);

      mockProductService.getInventory.mockReturnValue(of(mockProducts));

      component.loadProducts();

      expect(mockProductService.getInventory).toHaveBeenCalledWith(1);

      expect(component.products).toEqual(mockProducts);
    });

    it('should handle errors when loading products', () => {
      jest.spyOn(component as any, 'getCurrentGroupId').mockReturnValue(1);

      mockProductService.getInventory.mockReturnValue(
        throwError(() => new Error('Error'))
      );

      jest.spyOn(component, 'addAlert');

      component.loadProducts();

      expect(component.addAlert).toHaveBeenCalledWith(
        'Erro ao carregar produtos. Tente novamente.'
      );
    });
  });

  describe('getFilteredProducts', () => {
    it('should filter products based on search query', () => {
      component.products = mockProducts;
      component.searchQuery = 'Ração';

      const filtered = component.getFilteredProducts();

      expect(filtered).toEqual([mockProducts[0]]);
    });
  });

  describe('openModal', () => {
    it('should open the modal with a selected product', () => {
      const product = mockProducts[0];
      component.openModal(product);

      expect(component.selectedProduct).toBe(product);
      expect(component.isModalOpen).toBe(true);
    });

    it('should open the modal without a product', () => {
      component.openModal();

      expect(component.selectedProduct).toBeNull();
      expect(component.isModalOpen).toBe(true);
    });
  });

  describe('closeModal', () => {
    it('should close the modal', () => {
      component.closeModal();

      expect(component.isModalOpen).toBe(false);
    });
  });

  describe('handleCreateProduct', () => {
    it('should create a new product and add to the list', () => {
      const newProduct = {
        id: 3,
        name: 'Orange',
        unity: Unity.Kilos,
        quantity: 5,
        group_Id: 1,
        order_Point: 1,
        ideal_Point: 2,
        type: Types.Animais,
        in_List: false,
      };
      mockProductService.createProduct.mockReturnValue(of(newProduct));
      jest.spyOn(component, 'addAlert');

      component.handleCreateProduct(newProduct);

      expect(mockProductService.createProduct).toHaveBeenCalledWith(
        newProduct,
        1
      );
      expect(component.products).toContain(newProduct);
      expect(component.addAlert).toHaveBeenCalledWith(
        'Produto criado com sucesso.'
      );
    });
  });

  describe('decrementQuantity', () => {
    it('should decrement product quantity and call consumeProduct', () => {
      const product = { ...mockProducts[0], quantity: 2 };
      component.products = [product];
      mockProductService.consumeProduct.mockReturnValue(of(null));
      jest.spyOn(component, 'addAlert');

      component.decrementQuantity(new MouseEvent('click'), product);

      expect(product.quantity).toBe(1);
      expect(mockProductService.consumeProduct).toHaveBeenCalledWith(
        product.id,
        product.group_Id,
        1
      );
      expect(component.addAlert).toHaveBeenCalledWith(
        'Quantidade atualizada com sucesso.'
      );
    });

    it('should handle errors and revert changes', () => {
      const product = { ...mockProducts[0], quantity: 2 };
      component.products = [product];
      mockProductService.consumeProduct.mockReturnValue(
        throwError(() => new Error('Error'))
      );
      jest.spyOn(component, 'addAlert');

      component.decrementQuantity(new MouseEvent('click'), product);

      expect(product.quantity).toBe(2);
      expect(component.addAlert).toHaveBeenCalledWith(
        'Erro ao atualizar a quantidade do produto.'
      );
    });
  });

  describe('addAlert and removeAlert', () => {
    it('should add an alert and remove it after timeout', () => {
      jest.useFakeTimers();
      component.addAlert('Test Alert');

      expect(component.alerts).toContain('Test Alert');

      jest.advanceTimersByTime(2000);

      expect(component.alerts).not.toContain('Test Alert');
    });
  });
});
