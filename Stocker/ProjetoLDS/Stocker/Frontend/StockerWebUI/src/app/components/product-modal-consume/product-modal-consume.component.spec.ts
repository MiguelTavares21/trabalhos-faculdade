import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductModalConsumeComponent } from './product-modal-consume.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { jest } from '@jest/globals';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Unity } from '../../enums/unity.enum';
import { Types } from '../../enums/types.enum';

describe('ProductModalConsumeComponent', () => {
  let component: ProductModalConsumeComponent;
  let fixture: ComponentFixture<ProductModalConsumeComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Ração',
    unity: Unity.Kilos,
    quantity: 10,
    group_Id: 1,
    order_Point: 1,
    ideal_Point: 3,
    type: Types.Animais,
    in_List: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        HttpClientTestingModule,
        ProductModalConsumeComponent,
      ],
      providers: [ProductService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductModalConsumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form with product quantity', () => {
      component.product = mockProduct;
      component.ngOnInit();

      expect(component.consumeProductForm.value).toEqual({
        quantity: 10,
      });
    });

    it('should close modal if no product is passed', () => {
      const spyOnClose = jest.spyOn(component.onClose, 'emit');
      component.product = null;
      component.ngOnInit();

      expect(spyOnClose).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should emit onSave with updated product data when form is valid', () => {
      const spyOnSave = jest.spyOn(component.onSave, 'emit');
      component.product = mockProduct;
      component.ngOnInit();

      component.consumeProductForm.setValue({
        quantity: 5,
      });

      component.onSubmit();

      expect(spyOnSave).toHaveBeenCalledWith({
        ...mockProduct,
        quantity: 5,
      });
    });

    it('should not emit onSave if form is invalid', () => {
      const spyOnSave = jest.spyOn(component.onSave, 'emit');
      const spyOnClose = jest.spyOn(component.onClose, 'emit');

      component.consumeProductForm.setValue({
        quantity: -1,
      });

      component.onSubmit();

      expect(spyOnSave).not.toHaveBeenCalled();
      expect(spyOnClose).not.toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('should emit onClose when closeModal is called', () => {
      const spyOnClose = jest.spyOn(component.onClose, 'emit');
      component.closeModal();
      expect(spyOnClose).toHaveBeenCalled();
    });
  });

  describe('openEditModal', () => {
    it('should open edit modal when productId is valid', () => {
      component.openEditModal(1);

      expect(component.showEditModal).toBe(true);
      expect(component.showConfirmationModal).toBe(false);
    });

    it('should throw an error when productId is invalid', () => {
      expect(() => component.openEditModal(0)).toThrowError(
        'ID do produto inválido ou não fornecido ao abrir o modal de edição.'
      );
    });
  });

  describe('closeEditModal', () => {
    it('should close the edit modal', () => {
      component.showEditModal = true;
      component.closeEditModal();
      expect(component.showEditModal).toBe(false);
    });
  });

  describe('stopPropagation', () => {
    it('should stop event propagation', () => {
      const mockEvent = { stopPropagation: jest.fn() };
      component.stopPropagation(mockEvent as any);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('getCurrentGroupId', () => {
    it('should return 0 if no group ID is found in localStorage', () => {
      localStorage.removeItem('selectedGroupId');
      component.ngOnInit();
      expect(component.currentGroupId).toBe(0);
    });

    it('should return the current group ID from localStorage', () => {
      localStorage.setItem('selectedGroupId', '5');

      const fixture = TestBed.createComponent(ProductModalConsumeComponent);
      const component = fixture.componentInstance;

      expect(component.currentGroupId).toBe(5);
    });
  });
});
