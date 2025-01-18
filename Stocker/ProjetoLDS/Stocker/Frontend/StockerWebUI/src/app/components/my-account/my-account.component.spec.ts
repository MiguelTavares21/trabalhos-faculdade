import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAccountComponent } from './my-account.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { jest } from '@jest/globals';

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: jest.Mocked<Router>;

beforeEach(async () => {
  mockAuthService = {
    getUserId: jest.fn().mockReturnValue('1'),
  } as unknown as jest.Mocked<AuthService>;

  mockUserService = {
    getUserById: jest.fn().mockReturnValue(
      of({
        id: 1,
        name: 'Test User',
        email: 'test@user.com',
        notifications: true,
      })
    ),
    getUserGroups: jest.fn().mockReturnValue(of([])),
    editAccount: jest.fn(),
    changePass: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  mockRouter = {
    navigate: jest.fn(),
  } as unknown as jest.Mocked<Router>;

  await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, CommonModule, MyAccountComponent],
    providers: [
      { provide: AuthService, useValue: mockAuthService },
      { provide: UserService, useValue: mockUserService },
      { provide: Router, useValue: mockRouter },
    ],
  }).compileComponents();

  fixture = TestBed.createComponent(MyAccountComponent);
  component = fixture.componentInstance;

  // Ensure all mocks are set up before triggering change detection
  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load user data and groups', () => {
      // Mock de retorno do serviço getUserById
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@user.com',
        notifications: true,
      };
      mockUserService.getUserById.mockReturnValue(of(mockUser));
      mockUserService.getUserGroups.mockReturnValue(
        of([
          {
            id: 1,
            name: 'Group 1',
            description: '123',
            budget: 123,
            access_code: true,
          },
        ])
      );
      component.ngOnInit();

      // Verifica se o usuário foi carregado corretamente
      expect(component.user).toEqual(mockUser);
      expect(component.editForm.value.name).toBe('Test User');
      expect(component.editForm.value.email).toBe('test@user.com');
      expect(component.totalGroups).toBe(1);
    });
  });

  describe('saveUserDetails', () => {
    it('should update user details and navigate to login on success', () => {
      component.editForm.setValue({
        name: 'Updated User',
        email: 'updated@test.com',
        notifications: false,
      });
      mockUserService.editAccount.mockReturnValue(
        of({
          id: 1,
          name: 'Updated User',
          email: 'updated@test.com',
          notifications: true,
        })
      );


      component.saveUserDetails();

      expect(mockUserService.editAccount).toHaveBeenCalledWith(
        component.editForm.value
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.alerts).toContain('Conta atualizada com sucesso.');
    });

    it('should show an error alert if the email is already in use', () => {
      mockUserService.editAccount.mockReturnValue(
        throwError(() => ({ status: 400 }))
      );
      component.saveUserDetails();

      expect(component.alerts).toContain('Esse email já se encontra em uso!');
    });

    it('should show an error alert if the form is invalid', () => {
      component.editForm.setValue({
        name: '',
        email: '',
        notifications: false,
      });

      component.saveUserDetails();

      expect(component.alerts).toContain(
        'Preencha todos os campos obrigatórios!'
      );
    });
  });

  describe('updatePassword', () => {
    it('should update password and navigate to login on success', () => {
      component.passwordForm.setValue({
        passAtual: 'oldPassword',
        novaPass: 'newPassword',
        confirmPass: 'newPassword',
      });
      mockUserService.changePass.mockReturnValue(of({}));

      component.updatePassword();

      expect(mockUserService.changePass).toHaveBeenCalledWith({
        passAtual: 'oldPassword',
        novaPass: 'newPassword',
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.alerts).toContain('Password atualizada com sucesso.');
    });

    it('should show an error if passwords do not match', () => {
      component.passwordForm.setValue({
        passAtual: 'oldPassword',
        novaPass: 'newPassword',
        confirmPass: 'differentPassword',
      });

      component.updatePassword();

      expect(component.alerts).toContain('As passes não estão iguais!');
    });

    it('should show an error alert if the current password is incorrect', () => {
      mockUserService.changePass.mockReturnValue(
        throwError(() => ({ status: 400 }))
      );

      component.updatePassword();

      expect(component.alerts).toContain('Erro a atualizar a password!');
    });
  });

  describe('togglePasswordForm', () => {
    it('should toggle the visibility of the password form', () => {
      expect(component.showPasswordForm).toBe(false);

      component.togglePasswordForm();

      expect(component.showPasswordForm).toBe(true);

      component.togglePasswordForm();

      expect(component.showPasswordForm).toBe(false);
    });
  });

  describe('addAlert', () => {
    it('should add a unique alert', () => {
      component.addAlert('Test alert');
      expect(component.alerts).toContain('Test alert');
    });

    it('should not add duplicate alerts', () => {
      component.addAlert('Test alert');
      component.addAlert('Test alert');
      expect(component.alerts.length).toBe(1);
    });
  });

  describe('removeAlert', () => {
    it('should remove a specific alert', () => {
      component.alerts = ['Alert 1', 'Alert 2'];
      component.removeAlert('Alert 1');
      expect(component.alerts).not.toContain('Alert 1');
      expect(component.alerts).toContain('Alert 2');
    });
  });
});
