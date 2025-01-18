import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateRecipeComponent } from './create-recipe.component';
import { RecipeService } from '../../services/recipe.service';
import { jest } from '@jest/globals';

describe('CreateRecipeComponent', () => {
  let component: CreateRecipeComponent;
  let fixture: ComponentFixture<CreateRecipeComponent>;
  let mockRecipeService: jest.Mocked<RecipeService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    // Criar mocks
    mockRecipeService = {
      createRecipe: jest.fn(),
    } as unknown as jest.Mocked<RecipeService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateRecipeComponent],
      providers: [
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the form with validators', () => {
      expect(component.createRecipeForm).toBeDefined();
      const nameControl = component.createRecipeForm.get('name');
      expect(nameControl?.valid).toBeFalsy();
      nameControl?.setValue('Test Recipe');
      expect(nameControl?.valid).toBeTruthy();
    });
  });

  describe('onCreateRecipe', () => {
    it('should call recipeService.createRecipe and emit close event on success', () => {
      const mockResponse = { id: 1, name: 'Test Recipe' };
      mockRecipeService.createRecipe.mockReturnValue(of(mockResponse));
      const closeSpy = jest.spyOn(component.close, 'emit');

      component.createRecipeForm.setValue({ name: 'Test Recipe' });
      component.onCreateRecipe();

      expect(mockRecipeService.createRecipe).toHaveBeenCalledWith(
        Number(component.selectedGroupId),
        { name: 'Test Recipe' }
      );
      expect(closeSpy).toHaveBeenCalledWith(mockResponse);
      expect(component.alerts).toContain('Receita criada com sucesso.');
    });

    it('should add an alert if recipe creation fails', () => {
      mockRecipeService.createRecipe.mockReturnValue(
        throwError(() => ({ error: { Error: ['Erro ao criar receita'] } }))
      );

      component.createRecipeForm.setValue({ name: 'Test Recipe' });
      component.onCreateRecipe();

      expect(component.alerts).toContain('Erro ao criar receita!');
    });

    it('should add an alert if the form is invalid', () => {
      component.createRecipeForm.setValue({ name: '' });
      component.onCreateRecipe();
      expect(component.alerts).toContain(
        'Por favor, preencha todos os campos obrigatórios!'
      );
    });
  });

  describe('addAlert', () => {
    it('should add a new alert if it does not already exist', () => {
      component.addAlert('Test Alert');
      expect(component.alerts).toContain('Test Alert');
    });

    it('should not add duplicate alerts', () => {
      component.addAlert('Duplicate Alert');
      component.addAlert('Duplicate Alert');
      expect(
        component.alerts.filter((a) => a === 'Duplicate Alert').length
      ).toBe(1);
    });
  });

  describe('removeAlert', () => {
    it('should remove the specified alert from the alerts array', () => {
      component.alerts = ['Alert 1', 'Alert 2'];
      component.removeAlert('Alert 1');
      expect(component.alerts).not.toContain('Alert 1');
      expect(component.alerts).toContain('Alert 2');
    });
  });

  describe('closePopupWithData', () => {
    it('should emit the close event with data', () => {
      const closeSpy = jest.spyOn(component.close, 'emit');
      const mockRecipe = { id: 1, name: 'Test Recipe' };
      component.closePopupWithData(mockRecipe);
      expect(closeSpy).toHaveBeenCalledWith(mockRecipe);
    });
  });

  describe('closePopup', () => {
    it('should emit the close event with null', () => {
      const closeSpy = jest.spyOn(component.close, 'emit');
      component.closePopup();
      expect(closeSpy).toHaveBeenCalledWith(null);
    });
  });
});
