import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductModalComponent } from './product-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { Unity } from '../../enums/unity.enum';
import { Types } from '../../enums/types.enum';
import { Product } from '../../models/product';
import { jest } from '@jest/globals';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductModalComponent', () => {
  let component: ProductModalComponent;
  let fixture: ComponentFixture<ProductModalComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Ração',
    unity: Unity.Gramas,
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
        CommonModule,
        AlertComponent,
        ProductModalComponent,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should update form when product is passed', () => {
      component.selectedProduct = mockProduct;
      component.ngOnChanges();

      expect(component.createProductForm.value).toEqual({
        name: 'Ração',
        unity: Unity.Gramas,
        ideal_Point: 3,
        order_Point: 1,
        quantity: 10,
        type: '',
      });
    });
  });

  describe('onSubmit', () => {
    it('should emit onSave with product data when form is valid', () => {
      const spyOnSave = jest.spyOn(component.onSave, 'emit');
      component.createProductForm.setValue({
        name: 'Produto',
        unity: Unity.Kilos,
        ideal_Point: 5,
        order_Point: 2,
        quantity: 15,
        type: Types.Artesanato_Jardim,
      });

      component.onSubmit();

      expect(spyOnSave).toHaveBeenCalledWith({
        ...component.createProductForm.value,
        group_Id: component.currentGroupId,
      });
    });

    it('should not emit if form is invalid', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      component.createProductForm.setValue({
        name: '',
        unity: Unity.Kilos,
        ideal_Point: 5,
        order_Point: 2,
        quantity: 15,
        type: Types.Lanches_Doces,
      });

      component.onSubmit();

      expect(consoleSpy).toHaveBeenCalledWith('Formulário inválido!');
      consoleSpy.mockRestore();
    });
  });

  describe('closeModal', () => {
    it('should reset the form and close the modal', () => {
      const spyOnClose = jest.spyOn(component.onClose, 'emit');
      component.createProductForm.setValue({
        name: 'Produto',
        unity: Unity.Kilos,
        ideal_Point: 5,
        order_Point: 2,
        quantity: 15,
        type: Types.Frutas_Verduras,
      });

      component.closeModal();

      expect(component.createProductForm.value).toEqual({
        name: null,
        unity: null,
        ideal_Point: null,
        order_Point: null,
        quantity: null,
        type: null,
      });
      expect(spyOnClose).toHaveBeenCalled();
    });
  });

  describe('addAlert and removeAlert', () => {
    it('should add an alert and remove it after 2 seconds', () => {
      jest.useFakeTimers();
      component.addAlert('Test Alert');

      expect(component.alerts).toContain('Test Alert');

      jest.advanceTimersByTime(2000);

      expect(component.alerts).not.toContain('Test Alert');
    });
  });

});
