import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RecipeService } from './recipe.service';
import { environment } from '../../environments/environment.development';
import { Recipe } from '../models/Recipes/recipe';
import { RecipeCreateDto } from '../models/Recipes/RecipeCreateDto';
import { ProductRecipeDto } from '../models/Recipes/ProductRecipeDto';
import { ProductAddToRecipeDto } from '../models/Recipes/ProductAddToRecipeDto';
import { Unity } from '../enums/unity.enum';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipeService],
    });
    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getGroupRecipes', () => {
    it('deve retornar receitas do grupo', () => {
      const groupId = 1;
      const mockRecipes: Recipe[] = [{ id: 1, name: 'Pasta' }];

      service.getGroupRecipes(groupId).subscribe((recipes) => {
        expect(recipes).toEqual(mockRecipes);
      });

      const req = httpMock.expectOne(`${apiUrl}/Recipe/${groupId}/recipes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRecipes);
    });
  });

  describe('getProductsInRecipe', () => {
    it('deve retornar produtos de uma receita', () => {
      const groupId = 1;
      const recipeId = 1;
      const mockProducts: ProductRecipeDto[] = [
        { productId: 1, name: 'Tomato', quantity: 2, recipeId: recipeId, unity: Unity.Gramas },
      ];
      service.getProductsInRecipe(groupId, recipeId).subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/Recipe/${groupId}/recipes/${recipeId}/products`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('changeRecipeName', () => {
    it('deve alterar o nome de uma receita', () => {
      const groupId = 1;
      const recipeId = 1;
      const recipeName: RecipeCreateDto = { Name: 'New Recipe Name' };
      const mockRecipe: Recipe = { id: 1, name: 'New Recipe Name' };

      service
        .changeRecipeName(recipeId, recipeName, groupId)
        .subscribe((recipe) => {
          expect(recipe).toEqual(mockRecipe);
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Recipe/${groupId}/recipes/${recipeId}/edit`
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(recipeName);
      req.flush(mockRecipe);
    });
  });

  describe('removeProductFromRecipe', () => {
    it('deve remover um produto de uma receita', () => {
      const groupId = 1;
      const recipeId = 1;
      const productId = 1;

      service
        .removeProductFromRecipe(recipeId, productId, groupId)
        .subscribe((response) => {
          expect(response).toBeDefined();
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Recipe/${groupId}/recipes/${recipeId}?productId=${productId}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('deleteRecipe', () => {
    it('deve deletar uma receita', () => {
      const groupId = 1;
      const recipeId = 1;

      service.deleteRecipe(recipeId, groupId).subscribe((response) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(
        `${apiUrl}/Recipe/${groupId}/recipes/?recipeId=${recipeId}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('consumeRecipe', () => {
    it('deve consumir uma receita', () => {
      const groupId = 1;
      const recipeId = 1;

      service.consumeRecipe(recipeId, groupId).subscribe((response) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(
        `${apiUrl}/Recipe/${groupId}/recipes/${recipeId}/consume`
      );
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });

  describe('createRecipe', () => {
    it('deve criar uma nova receita', () => {
      const groupId = 1;
      const recipe = { name: 'New Recipe' };

      service.createRecipe(groupId, recipe).subscribe((response) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/Recipe/${groupId}/recipes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(recipe);
      req.flush({});
    });
  });

  describe('addProductToRecipe', () => {
    it('deve adicionar um produto a uma receita', () => {
      const groupId = 1;
      const recipeId = 1;
      const newProduct: ProductAddToRecipeDto = { name: "nameP", quantity: 2 };

      service
        .addProductToRecipe(recipeId, newProduct, groupId)
        .subscribe((response) => {
          expect(response).toBeDefined();
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Recipe/${groupId}/recipes/${recipeId}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush({});
    });
  });

  describe('editProductInRecipe', () => {
    it('deve editar um produto em uma receita', () => {
      const groupId = 1;
      const recipeId = 1;
      const updatedProduct: ProductAddToRecipeDto = {
        name: "nameP",
        quantity: 3,
      };
      const mockRecipe: Recipe = { id: 1, name: 'Updated Recipe' };

      service
        .editProductInRecipe(recipeId, updatedProduct, groupId)
        .subscribe((recipe) => {
          expect(recipe).toEqual(mockRecipe);
        });

      const req = httpMock.expectOne(
        `${apiUrl}/Recipe/${groupId}/recipes/${recipeId}/editProduct`
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(mockRecipe);
    });
  });
});
