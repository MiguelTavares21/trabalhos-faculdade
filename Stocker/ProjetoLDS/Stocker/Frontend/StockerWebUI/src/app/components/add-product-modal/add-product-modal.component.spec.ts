import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductModalComponent } from './add-product-modal.component';
import { Product } from '../../models/product';
import { Types } from '../../enums/types.enum';
import { Unity } from '../../enums/unity.enum';

describe('AddProductModalComponent', () => {
  let component: AddProductModalComponent;
  let fixture: ComponentFixture<AddProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductModalComponent);
    component = fixture.componentInstance;

    component.products = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeModal', () => {
    it('should emit onClose when closeModal is called', () => {
      let closeCalled = false;
      component.onClose.subscribe(() => {
        closeCalled = true;
      });

      component.closeModal();

      expect(closeCalled).toBeTruthy();
    });
  });

  describe('addProduct', () => {
    it('should emit onAdd and onClose when addProduct is called with a valid product', () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Test Product',
        quantity: 50,
        unity: Unity.Gramas,
        order_Point: 20,
        ideal_Point: 100,
        type: Types.Lanches_Doces,
        in_List: true,
        group_Id: 2,
      };

      let addProductCalled = false;
      let closeCalled = false;

      component.onAdd.subscribe((product) => {
        if (product.id === mockProduct.id) {
          addProductCalled = true;
        }
      });

      component.onClose.subscribe(() => {
        closeCalled = true;
      });

      component.addProduct(mockProduct);

      expect(addProductCalled).toBeTruthy();
      expect(closeCalled).toBeTruthy();
    });
  });

  describe('Input handling', () => {
    it('should handle empty product list as input', () => {
      component.products = [];
      fixture.detectChanges();
      expect(component.products.length).toEqual(0);
    });

    it('should correctly assign products via @Input', () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Product A',
          quantity: 10,
          unity: Unity.Kilos,
          order_Point: 5,
          ideal_Point: 20,
          type: Types.Congelados,
          in_List: true,
          group_Id: 1,
        },
        {
          id: 2,
          name: 'Product B',
          quantity: 5,
          unity: Unity.Unidades,
          order_Point: 2,
          ideal_Point: 10,
          type: Types.Casa,
          in_List: false,
          group_Id: 2,
        },
      ];

      component.products = mockProducts;
      fixture.detectChanges();

      expect(component.products).toEqual(mockProducts);
    });
  });
});
