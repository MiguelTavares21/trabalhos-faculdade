import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterPurchaseComponent } from './register-purchase.component';
import { ProductService } from '../../services/product.service';
import { PurchasesService } from '../../services/purchases.service';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product';
import { PurchaseProduct } from '../../models/purchaseProduct';
import { Router } from '@angular/router';
import { jest } from '@jest/globals';
import { Unity } from '../../enums/unity.enum';
import { Types } from '../../enums/types.enum';

describe('RegisterPurchaseComponent', () => {
  let component: RegisterPurchaseComponent;
  let fixture: ComponentFixture<RegisterPurchaseComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockPurchasesService: jest.Mocked<PurchasesService>;
  let mockRouter: jest.Mocked<Router>;

  const mockProducts: Product[] = [
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
    {
      id: 2,
      name: 'Product 2',
      group_Id: 1,
      quantity: 15,
      ideal_Point: 1,
      unity: Unity.Gramas,
      order_Point: 20,
      type: Types.Carne_Peixe,
      in_List: false,
    },
  ];

  const mockPurchaseProduct: PurchaseProduct = {
    name: 'Product 1',
    product_Id: 1,
    unity: Unity.Gramas,
    price: 100,
    quantity: 2,
  };

  beforeEach(async () => {
    mockProductService = {
      getProductsByGroup: jest.fn().mockReturnValue(of(mockProducts)),
      createProduct: jest.fn().mockReturnValue(of(mockProducts[0])),
    } as unknown as jest.Mocked<ProductService>;

    mockPurchasesService = {
      registerPurchase: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PurchasesService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [RegisterPurchaseComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: PurchasesService, useValue: mockPurchasesService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPurchaseComponent);
    component = fixture.componentInstance;
    localStorage.setItem('selectedGroupId', '1');
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('selectedGroupId');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Alerts', () => {
    it('should add and remove alerts', fakeAsync(() => {
      component.addAlert('Test Alert');
      expect(component.alerts).toContain('Test Alert');

      tick(3000);

      component.removeAlert('Test Alert');

      expect(component.alerts).not.toContain('Test Alert');
    }));
  });

  describe('Modal Operations', () => {
    it('should open and close product selection modal', fakeAsync(() => {
      component.openModal();

      expect(component.isModalOpen).toBe(true);
      expect(mockProductService.getProductsByGroup).toHaveBeenCalledWith(1);

      component.closeModal();
      expect(component.isModalOpen).toBe(false);
    }));

    it('should open and close create product modal', () => {
      component.openCreateModal();
      expect(component.isCreateModalOpen).toBe(true);

      component.closeCreateModal();
      expect(component.isCreateModalOpen).toBe(false);
    });

    it('should open and close purchase modal', () => {
      component.openPurchaseModal();
      expect(component.isPurchaseModalOpen).toBe(true);

      component.closePurchaseModal();
      expect(component.isPurchaseModalOpen).toBe(false);
    });
  });

  describe('Product Operations', () => {
    it('should add a product to the purchase list', () => {
      component.addProductToList(mockProducts[0]);
      expect(component.selectedProduct).toBe(mockProducts[0]);
      expect(component.isPurchaseModalOpen).toBe(true);
    });

    it('should handle product creation', () => {
      const newProduct = { ...mockProducts[0], id: 3 };
      mockProductService.createProduct.mockReturnValue(of(newProduct));

      component.handleCreateProduct(newProduct);

      expect(mockProductService.createProduct).toHaveBeenCalledWith(
        newProduct,
        newProduct.group_Id
      );
      expect(component.isCreateModalOpen).toBe(false);
      expect(component.isPurchaseModalOpen).toBe(true);
      expect(component.selectedProduct).toBe(newProduct);
    });

   it('should handle product purchase', () => {
     component.selectedProduct = {
       id: 1,
       name: 'Product 1',
       unity: Unity.Gramas,
       quantity: 10,
       group_Id: 1,
       ideal_Point: 1,
       order_Point: 20,
       type: Types.Carne_Peixe,
       in_List: false,
     };

     component.handlePurchase({ price: 100, quantity: 2 });

     expect(component.products.length).toBe(1);
     expect(component.products[0]).toEqual({
       name: 'Product 1',
       product_Id: 1,
       unity: Unity.Gramas,
       price: 100,
       quantity: 2,
     });

     expect(component.isPurchaseModalOpen).toBe(false);
   });


  });

  describe('Purchase Registration', () => {
    it('should save purchase successfully', () => {
      component.savePurchase();

      expect(mockPurchasesService.registerPurchase).toHaveBeenCalledWith(
        component.products,
        0
      );
      expect(component.alerts).toContain('Compra registrada com sucesso.');
      expect(component.products.length).toBe(0);
    });

    it('should show an error alert if purchase fails', () => {
      mockPurchasesService.registerPurchase.mockReturnValue(
        throwError(() => new Error('Erro ao registrar compra'))
      );

      component.savePurchase();

      expect(component.alerts).toContain('Erro ao registrar compra.');
    });
  });

  describe('Remove Product from List', () => {
    it('should remove a product from the list', () => {
      component.products = [mockPurchaseProduct];
      component.removeFromList(mockPurchaseProduct.product_Id);

      expect(component.products).toEqual([]);
    });
  });
});
