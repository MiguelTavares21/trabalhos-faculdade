import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PurchaseModalComponent } from './purchase-modal.component';
import { jest } from '@jest/globals';

describe('PurchaseModalComponent', () => {
  let component: PurchaseModalComponent;
  let fixture: ComponentFixture<PurchaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PurchaseModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the createProductForm with default values', () => {
      expect(component.createProductForm).toBeDefined();
      expect(component.createProductForm.value).toEqual({
        price: 0,
        quantity: 0,
      });
    });
  });

  describe('onSubmit', () => {
    it('should emit onSave with form values when the form is valid', () => {
      const spy = jest.spyOn(component.onSave, 'emit');

      component.createProductForm.setValue({
        price: 10,
        quantity: 2,
      });

      component.onSubmit();

      expect(spy).toHaveBeenCalledWith({
        price: 10,
        quantity: 2,
      });
    });

    it('should not emit onSave when the form is invalid', () => {
      const spy = jest.spyOn(component.onSave, 'emit');

      component.createProductForm.setValue({
        price: -5, // Invalid price
        quantity: 0, // Invalid quantity
      });

      component.onSubmit();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('should reset the form and emit onClose', () => {
      const spy = jest.spyOn(component.onClose, 'emit');

      component.createProductForm.setValue({
        price: 15,
        quantity: 3,
      });

      component.closeModal();

      expect(component.createProductForm.value).toEqual({
        price: null,
        quantity: null,
      });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Form Validations', () => {
    it('should mark the form as invalid if price is less than 0', () => {
      component.createProductForm.controls['price'].setValue(-1);
      component.createProductForm.controls['quantity'].setValue(1);

      expect(component.createProductForm.valid).toBeFalsy();
    });

    it('should mark the form as invalid if quantity is less than 0.01', () => {
      component.createProductForm.controls['price'].setValue(10);
      component.createProductForm.controls['quantity'].setValue(0);

      expect(component.createProductForm.valid).toBeFalsy();
    });

    it('should mark the form as valid if all values are correct', () => {
      component.createProductForm.controls['price'].setValue(10);
      component.createProductForm.controls['quantity'].setValue(1);

      expect(component.createProductForm.valid).toBeTruthy();
    });
  });
});
