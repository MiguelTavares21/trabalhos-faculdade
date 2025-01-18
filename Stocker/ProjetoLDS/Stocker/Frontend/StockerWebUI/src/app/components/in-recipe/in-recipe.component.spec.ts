import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InRecipeComponent } from './in-recipe.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { ProductService } from '../../services/product.service';
import { Observable, of, throwError } from 'rxjs';
import { Recipe } from '../../models/Recipes/recipe';
import { Product } from '../../models/product';
import { ProductRecipeDto } from '../../models/Recipes/ProductRecipeDto';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { jest } from '@jest/globals';
import { RecipeCreateDto } from '../../models/Recipes/RecipeCreateDto';

describe('InRecipeComponent', () => {
  let component: InRecipeComponent;
  let fixture: ComponentFixture<InRecipeComponent>;
  let mockRecipeService: jest.Mocked<RecipeService>;
  let mockProductService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    mockRecipeService = {
      getProductsInRecipe: jest.fn().mockReturnValue(of([])),
      changeRecipeName: jest.fn().mockReturnValue(of({})),
      addProductToRecipe: jest.fn().mockReturnValue(of({})),
      editProductInRecipe: jest.fn().mockReturnValue(of({})),
      removeProductFromRecipe: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<RecipeService>;

    mockProductService = {
      getProductsByGroup: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<ProductService>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AlertComponent,
        InRecipeComponent,
      ],
      providers: [
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InRecipeComponent);
    component = fixture.componentInstance;
    component.recipe = {
      id: 1,
      name: 'Mock Recipe',
    } as Recipe;
      component.selectedGroupId = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form controls and fetch products in recipe', () => {
      const mockRecipe: Recipe = { id: 1, name: 'Recipe 1' } as Recipe;
      component.recipe = mockRecipe;
      component.ngOnInit();

      expect(component.updatedRecipeName).toBe(mockRecipe.name);
      expect(mockProductService.getProductsByGroup).toHaveBeenCalled();
    });
  });

  describe('changeRecipeName', () => {
    it('should call changeRecipeName and update alerts on success', () => {
      const mockRecipe = { id: 1, name: 'Original Recipe' };
      const updatedName = 'Updated Recipe Name';

      mockRecipeService.changeRecipeName = jest
        .fn()
        .mockReturnValue(
          of({ id: mockRecipe.id, name: updatedName })
        ) as jest.Mock<
        (
          recipeId: number,
          recipeName: RecipeCreateDto,
          groupId: number
        ) => Observable<Recipe>
      >;

      component.recipe = mockRecipe;
      component.updatedRecipeName = updatedName;

      component.changeRecipeName();


      expect(mockRecipeService.changeRecipeName).toHaveBeenCalledWith(
        mockRecipe.id,
        { Name: updatedName },
        1
      );
      expect(component.alerts).toContain(
        'Nome da receita atualizado com sucesso.'
      );
    });




    it(
      'should add an alert if there is an error when changing the recipe name',
      () => {

          mockRecipeService.changeRecipeName.mockReturnValue(
            throwError(() => ({
              error: { Error: ['API error' ]},
            }))
          );

        component.alerts = [];


        component.changeRecipeName();

        expect(component.alerts).toContain('API error!');
      }
    );

  });

  describe('adicionarProduto', () => {
    it('should add a product to the recipe if the form is valid', () => {
      const mockProduct = {
        name: 'Product 1',
        quantity: 1,
      } as ProductRecipeDto;

      component.addProductToRecipe.setValue(mockProduct);

      mockRecipeService.addProductToRecipe.mockReturnValue(of({}));


      component.alerts = [];

      component.adicionarProduto();


      expect(mockRecipeService.addProductToRecipe).toHaveBeenCalledWith(
        component.recipe.id,
        mockProduct,
        1
      );

      expect(component.alerts).toContain('Produto adicionado com sucesso.');
    });


    it('should show an alert if the form is invalid', () => {
      component.addProductToRecipe.setValue({ name: '', quantity: '' });

      component.adicionarProduto();

      expect(component.alerts).toContain('Formulário inválido!');
    });
  });

  describe('openAddProductPopup', () => {
    it('should toggle the add product popup', () => {
      component.openAddProductPopup();
      expect(component.addToggle).toBe(true);
      expect(component.editToggle).toBe(false);
    });
  });

  describe('alerts', () => {
    it('should add and remove alerts correctly', () => {
      const alertMessage = 'Test Alert';
      component.addAlert(alertMessage);
      expect(component.alerts).toContain(alertMessage);

      component.removeAlert(alertMessage);
      expect(component.alerts).not.toContain(alertMessage);
    });
  });
});
