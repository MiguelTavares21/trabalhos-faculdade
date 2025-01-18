import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { jest } from '@jest/globals';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    authServiceMock = {
      getToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  describe('canActivate', () => {
    it('deve permitir acesso se o token estiver presente', () => {
      // Arrange
      authServiceMock.getToken.mockReturnValue('valid-token');

      // Act
      const result = guard.canActivate();

      // Assert
      expect(result).toBe(true);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('deve redirecionar para "/login" se o token não estiver presente', () => {
      // Arrange
      authServiceMock.getToken.mockReturnValue(null);

      // Act
      const result = guard.canActivate();

      // Assert
      expect(result).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
