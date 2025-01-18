import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductModalEditComponent } from './product-modal-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { of, throwError } from 'rxjs';
import { jest } from '@jest/globals';
import { Unity } from '../../enums/unity.enum';
import { Types } from '../../enums/types.enum';

describe('ProductModalEditComponent', () => {
  let component: ProductModalEditComponent;
  let fixture: ComponentFixture<ProductModalEditComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Produto Teste',
    unity: Unity.Kilos,
    quantity: 100,
    group_Id: 1,
    order_Point: 5,
    ideal_Point: 10,
    type: Types.Animais,
    in_List: false
  };

  const mockProductService = {
    deleteProduct: jest.fn().mockReturnValue(of(null)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, ProductModalEditComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the form with product data', () => {
      component.product = mockProduct;
      component.ngOnInit();

      expect(component.editProductForm.value).toEqual({
        name: 'Produto Teste',
        unity: 'Kilos',
        quantity: 100,
        order_Point: 5,
        ideal_Point: 10,
      });
    });
  });

  describe('onSubmit', () => {
    it('should emit onSave with updated product data when form is valid', () => {
      const spyOnSave = jest.spyOn(component.onSave, 'emit');
      component.product = mockProduct;
      component.editProductForm.setValue({
        name: 'Produto Atualizado',
        unity: 'kg',
        quantity: 120,
        order_Point: 10,
        ideal_Point: 15,
      });

      component.onSubmit();

      expect(spyOnSave).toHaveBeenCalledWith({
        ...mockProduct,
        ...component.editProductForm.value,
        group_Id: component.currentGroupId,
      });
    });

    it('should not emit onSave if form is invalid', () => {
      const spyOnSave = jest.spyOn(component.onSave, 'emit');
      component.editProductForm.setValue({
        name: '',
        unity: 'kg',
        quantity: -1,
        order_Point: 10,
        ideal_Point: 15,
      });

      component.onSubmit();

      expect(spyOnSave).not.toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('should emit onClose to close the modal', () => {
      const spyOnClose = jest.spyOn(component.onClose, 'emit');
      component.closeModal();

      expect(spyOnClose).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should call deleteProduct and emit onDelete on successful deletion', () => {
      const spyOnDelete = jest.spyOn(component.onDelete, 'emit');

      component.product = mockProduct;
      component.deleteProduct();

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(
        component.currentGroupId,
        mockProduct.id
      );
      expect(spyOnDelete).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should display an error message if delete fails', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      mockProductService.deleteProduct.mockReturnValue(throwError('Error'));

      component.product = mockProduct;
      component.deleteProduct();

      expect(alertSpy).toHaveBeenCalledWith(
        'Erro ao eliminar o produto. Por favor, tente novamente.'
      );
    });

    it('should show alert if no product is selected for deletion', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      component.product = null;

      component.deleteProduct();

      expect(alertSpy).toHaveBeenCalledWith(
        'Erro ao eliminar o produto. Por favor, tente novamente.'
      );
    });

  });

  describe('openEditModal', () => {
    it('should set the correct product ID when opening the edit modal', () => {
      component.openEditModal(1);

      expect(component.selectedProductId).toBe(1);
      expect(component.showEditModal).toBeTruthy();
    });
  });

  describe('closeEditModal', () => {
    it('should close the edit modal', () => {
      component.closeEditModal();

      expect(component.showEditModal).toBeFalsy();
    });
  });
});
