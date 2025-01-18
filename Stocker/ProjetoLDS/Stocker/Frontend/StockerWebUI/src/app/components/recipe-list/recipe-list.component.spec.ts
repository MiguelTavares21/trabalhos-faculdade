import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeService } from '../../services/recipe.service';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Recipe } from '../../models/Recipes/recipe';
import { Product } from '../../models/product';
import { jest } from '@jest/globals';
import { Unity } from '../../enums/unity.enum';
import { Types } from '../../enums/types.enum';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let mockRecipeService: jest.Mocked<RecipeService>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;

  const mockRecipes: Recipe[] = [
    { id: 1, name: 'Recipe 1' },
    { id: 2, name: 'Recipe 2' },
  ];

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

beforeEach(async () => {
  mockRecipeService = {
    getGroupRecipes: jest.fn().mockReturnValue(of(mockRecipes)),
    getProductsInRecipe: jest.fn(),
    deleteRecipe: jest.fn(),
    consumeRecipe: jest.fn(),
  } as unknown as jest.Mocked<RecipeService>;

  mockProductService = {
    getProductsByGroup: jest.fn().mockReturnValue(of(mockProducts)),
  } as unknown as jest.Mocked<ProductService>;

  mockRouter = {
    navigate: jest.fn(),
  } as unknown as jest.Mocked<Router>;

  await TestBed.configureTestingModule({
    imports: [RecipeListComponent],
    providers: [
      { provide: RecipeService, useValue: mockRecipeService },
      { provide: ProductService, useValue: mockProductService },
      { provide: Router, useValue: mockRouter },
    ],
  }).compileComponents();

  fixture = TestBed.createComponent(RecipeListComponent);
  component = fixture.componentInstance;

  localStorage.setItem('selectedGroupId', '1');
  component.selectedGroupId = localStorage.getItem('selectedGroupId')!;

  fixture.detectChanges();
});



  afterEach(() => {
    localStorage.removeItem('selectedGroupId');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch group recipes and products if selectedGroupId is valid', () => {
      localStorage.setItem('selectedGroupId', '1');
      mockRecipeService.getGroupRecipes.mockReturnValue(of(mockRecipes));
      mockProductService.getProductsByGroup.mockReturnValue(of(mockProducts));

      component.ngOnInit();

      expect(mockRecipeService.getGroupRecipes).toHaveBeenCalledWith(1);
      expect(mockProductService.getProductsByGroup).toHaveBeenCalledWith(1);
      expect(component.recipes).toEqual(mockRecipes);
      expect(component.ingredients).toEqual(mockProducts);
    });

    it('should log an error if selectedGroupId is invalid', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      localStorage.setItem('selectedGroupId', 'invalid');
      component.selectedGroupId = localStorage.getItem('selectedGroupId')!;

      component.ngOnInit();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Grupo inválido ou não encontrado!'
      );
      consoleSpy.mockRestore();
    });

  });

  describe('filterRecipes', () => {
    it('should filter recipes by search query', () => {
      component.recipes = mockRecipes;
      component.searchQuery = 'recipe 1';

      component.filterRecipes();

      expect(component.filteredRecipes).toEqual([{ id: 1, name: 'Recipe 1' }]);
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe and show a success alert', () => {
      mockRecipeService.deleteRecipe.mockReturnValue(of(null));
      component.recipes = mockRecipes;
      component.filteredRecipes = [...mockRecipes];

      component.deleteRecipe(1);

      expect(mockRecipeService.deleteRecipe).toHaveBeenCalledWith(
        1,
        Number(component.selectedGroupId)
      );
      expect(component.recipes).toEqual([{ id: 2, name: 'Recipe 2' }]);
      expect(component.alerts).toContain('Receita removida com sucesso.');
    });

    it('should show an error alert on failure', () => {
      mockRecipeService.deleteRecipe.mockReturnValue(
        throwError(() => ({ error: { Error: ['Erro ao remover'] } }))
      );

      component.deleteRecipe(1);

      expect(component.alerts).toContain('Erro ao remover!');
    });
  });

  describe('consumeRecipe', () => {
    it('should consume a recipe and show a success alert', () => {
      mockRecipeService.consumeRecipe.mockReturnValue(of(null));

      component.consumeRecipe(1);

      expect(mockRecipeService.consumeRecipe).toHaveBeenCalledWith(
        1,
        Number(component.selectedGroupId)
      );
      expect(component.alerts).toContain('Receita consumida.');
    });

    it('should show an error alert on failure', () => {
      mockRecipeService.consumeRecipe.mockReturnValue(
        throwError(() => ({ error: { Error: ['Erro ao consumir'] } }))
      );

      component.consumeRecipe(1);

      expect(component.alerts).toContain('Erro ao consumir!');
    });
  });

  describe('Alerts', () => {
    it('should add and remove alerts', fakeAsync(() => {
      component.addAlert('Test Alert');
      expect(component.alerts).toContain('Test Alert');

      tick(2000);

      expect(component.alerts).not.toContain('Test Alert');
    }));
  });
});
