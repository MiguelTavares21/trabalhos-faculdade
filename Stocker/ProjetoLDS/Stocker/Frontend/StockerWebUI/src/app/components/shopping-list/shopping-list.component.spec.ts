import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ShoppingListComponent } from './shopping-list.component';
import { PurchasesService } from '../../services/purchases.service';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { AlertComponent } from '../alert/alert.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { jest } from '@jest/globals';
import { Unity } from '../../enums/unity.enum';
import { Types } from '../../enums/types.enum';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let mockPurchasesService: jest.Mocked<PurchasesService>;
  let mockProductService: jest.Mocked<ProductService>;

  const mockShoppingList: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      unity: Unity.Kilos,
      quantity: 10,
      order_Point: 1,
      ideal_Point: 20,
      type: Types.Animais,
      in_List: false,
      group_Id: 1,
    },
    {
      id: 2,
      name: 'Product 2',
      unity: Unity.Litros,
      quantity: 10,
      order_Point: 1,
      ideal_Point: 20,
      type: Types.Animais,
      in_List: false,
      group_Id: 1,
    },
  ];

  const mockProducts: Product[] = [
    {
      id: 3,
      name: 'Product 3',
      unity: Unity.Gramas,
      quantity: 10,
      order_Point: 1,
      ideal_Point: 20,
      type: Types.Animais,
      in_List: false,
      group_Id: 1,
    },
    {
      id: 4,
      name: 'Product 4',
      unity: Unity.Unidades,
      quantity: 10,
      order_Point: 1,
      ideal_Point: 20,
      type: Types.Animais,
      in_List: false,
      group_Id: 1,
    },
  ];

  beforeEach(async () => {
    mockPurchasesService = {
      getShoppingList: jest.fn().mockReturnValue(of(mockShoppingList)),
      toggleFromShoppingList: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PurchasesService>;

    mockProductService = {
      getProductsByGroup: jest.fn().mockReturnValue(of(mockProducts)),
    } as unknown as jest.Mocked<ProductService>;

    await TestBed.configureTestingModule({
      imports: [
        ShoppingListComponent,
        CommonModule,
        FormsModule,
        RouterModule,
        AddProductModalComponent,
        AlertComponent,
      ],
      providers: [
        { provide: PurchasesService, useValue: mockPurchasesService },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    localStorage.setItem('selectedGroupId', '1');
  });

  afterEach(() => {
    localStorage.removeItem('selectedGroupId');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Alerts', () => {
    it('should add and remove alerts', () => {
      component.addAlert('Test Alert');
      expect(component.alerts).toContain('Test Alert');

      component.removeAlert('Test Alert');
      expect(component.alerts).not.toContain('Test Alert');
    });
  });

  describe('Shopping List Operations', () => {
    it('should load shopping list on init', () => {
      component.ngOnInit();
      expect(mockPurchasesService.getShoppingList).toHaveBeenCalledWith(1);
      expect(component.shoppingList.length).toBe(2);
    });

    it('should filter products by search query', () => {
      component.searchQuery = 'Product 1';
      const filteredProducts = component.getFilteredProducts();
      expect(filteredProducts.length).toBe(0);
    });

    it('should remove a product from the shopping list', () => {
      const product = mockShoppingList[0];
      component.removeFromList(product);
      expect(mockPurchasesService.toggleFromShoppingList).toHaveBeenCalledWith(
        1,
        1
      );
      expect(component.shoppingList.length).toBe(0);
    });

    it('should add a product to the shopping list', () => {
      const product = mockProducts[0];
      component.addProductToList(product);
      expect(mockPurchasesService.toggleFromShoppingList).toHaveBeenCalledWith(
        3,
        1
      );
    });


    it('should open modal and fetch products', () => {
      component.openModal();
      expect(mockProductService.getProductsByGroup).toHaveBeenCalledWith(1);
      expect(component.products.length).toBe(2);
      expect(component.isModalOpen).toBe(true);
    });

    it('should close modal', () => {
      component.closeModal();
      expect(component.isModalOpen).toBe(false);
    });
  });
});
