import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ShoppingHistoryComponent } from './shopping-history.component';
import { PurchasesService } from '../../services/purchases.service';
import { of, throwError } from 'rxjs';
import { Purchase } from '../../models/purchase';
import { PurchaseProduct } from '../../models/purchaseProduct';
import { AlertComponent } from '../alert/alert.component';
import { CommonModule } from '@angular/common';
import { jest } from '@jest/globals';
import { Unity } from '../../enums/unity.enum';

describe('ShoppingHistoryComponent', () => {
  let component: ShoppingHistoryComponent;
  let fixture: ComponentFixture<ShoppingHistoryComponent>;
  let mockPurchasesService: jest.Mocked<PurchasesService>;

  const mockPurchases: Purchase[] = [
    {
      id: 1,
      date: '2024-12-01',
      price: 200,
      group_Id: 1,
    },
    {
      id: 2,
      date: '2024-12-02',
      price: 150,
      group_Id: 1,
    },
  ];

  const mockPurchaseProducts: PurchaseProduct[] = [
    {
      name: 'Product 1',
      product_Id: 1,
      unity: Unity.Gramas,
      price: 100,
      quantity: 2,
    },
    {
      name: 'Product 2',
      product_Id: 2,
      unity: Unity.Litros,
      price: 50,
      quantity: 3,
    },
  ];

  beforeEach(async () => {
    mockPurchasesService = {
      getHistory: jest.fn().mockReturnValue(of(mockPurchases)),
      getPurchaseDetails: jest.fn().mockReturnValue(of(mockPurchaseProducts)),
      deletePurchase: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PurchasesService>;

    await TestBed.configureTestingModule({
      imports: [ShoppingHistoryComponent, CommonModule, AlertComponent],
      providers: [
        { provide: PurchasesService, useValue: mockPurchasesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingHistoryComponent);
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
    it('should add and remove alerts', fakeAsync(() => {
      component.addAlert('Test Alert');
      expect(component.alerts).toContain('Test Alert');

      // Manually remove alert after the test runs
      component.removeAlert('Test Alert');
      expect(component.alerts).not.toContain('Test Alert');
    }));
  });

  describe('Purchase Operations', () => {
    it('should load purchase history on init', () => {
      component.ngOnInit();
      expect(mockPurchasesService.getHistory).toHaveBeenCalledWith(0);
      expect(component.purchases.length).toBe(2);
    });

    it('should open purchase details', () => {
      component.openPurchase(1);
      expect(mockPurchasesService.getPurchaseDetails).toHaveBeenCalledWith(
        1,
        0
      );
      expect(component.selectedPurchaseProducts.length).toBe(2);
    });

    it('should delete a purchase successfully', () => {
      component.delete(1);
      expect(mockPurchasesService.deletePurchase).toHaveBeenCalledWith(1, 0);
      expect(component.purchases.length).toBe(1);
      expect(component.alerts).toContain('Compra eliminada com sucesso!');
    });

  });

  describe('Purchase Detail Modal', () => {
    it('should check if a purchase is open', () => {
      component.selectedPurchase = 1;
      expect(component.checkOpenPurchase(1)).toBe(true);
      expect(component.checkOpenPurchase(2)).toBe(false);
    });
  });

  describe('Remove Alerts', () => {
    it('should remove an alert from the list', () => {
      component.addAlert('Test Alert');
      component.removeAlert('Test Alert');
      expect(component.alerts).not.toContain('Test Alert');
    });
  });
});
