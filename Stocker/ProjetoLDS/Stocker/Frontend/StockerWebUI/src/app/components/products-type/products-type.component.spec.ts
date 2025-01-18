import { TestBed } from '@angular/core/testing';
import { ProductsTypeComponent } from './products-type.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Types } from '../../enums/types.enum';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProductService } from '../../services/product.service';
import { TypeLabels } from '../../utils/typeLabels';

describe('ProductsTypeComponent', () => {
  let component: ProductsTypeComponent;

  beforeEach(async () => {
    const productServiceMock = {
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ProductModalComponent,
        ProductsTypeComponent,
      ],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductsTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly map typesArray with labels', () => {
    const expectedArray = Object.entries(Types).map(([key, value]) => ({
      key,
      label: TypeLabels[value],
    }));

    expect(component.typesArray).toEqual(expectedArray);
  });

  describe('getIconForType', () => {
    it('should return the correct icon path for a given type key', () => {
      const icon = component.getIconForType('Frutas_Verduras');
      expect(icon).toBe('frutas_e_verduras.png');
    });

    it('should return an empty string for an unknown type key', () => {
      const icon = component.getIconForType('Unknown_Type');
      expect(icon).toBe('');
    });
  });
});
