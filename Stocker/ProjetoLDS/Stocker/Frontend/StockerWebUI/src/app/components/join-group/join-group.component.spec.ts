import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinGroupComponent } from './join-group.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { jest } from '@jest/globals';

describe('JoinGroupComponent', () => {
  let component: JoinGroupComponent;
  let fixture: ComponentFixture<JoinGroupComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockUserService = {
      joinGroup: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, JoinGroupComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('joinGroup', () => {
    it('should show error if access code is empty', () => {
      component.accessCode = '';
      component.joinGroup();
      expect(component.errorMessage).toBe('Código de acesso é obrigatório.');
    });

    it('should call userService.joinGroup and navigate on success', () => {
      component.accessCode = 'validCode';
      mockUserService.joinGroup.mockReturnValue(of({}));

      component.joinGroup();

      expect(mockUserService.joinGroup).toHaveBeenCalledWith('validCode');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
      expect(component.errorMessage).toBe('');
    });

    it('should show error message when the access code is invalid', () => {
      component.accessCode = 'invalidCode';
      mockUserService.joinGroup.mockReturnValue(
        throwError(() => ({
          status: 400,
          error: 'Código inválido.',
        }))
      );

      component.joinGroup();

      expect(component.errorMessage).toBe(
        'Código inválido.'
      );
    });

    it('should show error message for other types of errors', () => {
      component.accessCode = 'invalidCode';
      mockUserService.joinGroup.mockReturnValue(
        throwError(() => ({
          status: 500,
          error: 'Unknown error',
        }))
      );

      component.joinGroup();

      expect(component.errorMessage).toBe(
        'Código inválido. Por favor, tente novamente.'
      );
    });
  });

  describe('closePopup', () => {
    it('should emit close event', () => {
      const closeSpy = jest.spyOn(component.close, 'emit');
      component.closePopup();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
