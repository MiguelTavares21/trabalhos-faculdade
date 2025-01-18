import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { jest } from '@jest/globals';

jest.mock('jwt-decode');

describe('AuthService', () => {
  let service: AuthService;

  const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {};

    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logout', () => {
    it('deve remover o token e selectedGroupId do localStorage', () => {
      service.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'selectedGroupId'
      );
    });
  });

  describe('getToken', () => {
    it('deve retornar o token armazenado no localStorage', () => {
      const mockToken = 'mockToken';
      mockLocalStorage.getItem.mockReturnValue(mockToken);

      const token = service.getToken();

      expect(token).toBe(mockToken);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('deve retornar null se o token não estiver armazenado', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const token = service.getToken();

      expect(token).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });
  });

  describe('setToken', () => {
    it('deve armazenar o token no localStorage', () => {
      const mockToken = 'mockToken';

      service.setToken(mockToken);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    });
  });

  describe('getUserId', () => {
    it('deve retornar o userId decodificado do token válido', () => {
      const mockToken = 'mockToken';
      const mockPayload = {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier':
          '123',
        exp: Date.now() / 1000 + 60,
      };

      mockLocalStorage.getItem.mockReturnValue(mockToken);
      (jwtDecode as jest.Mock).mockReturnValue(mockPayload);

      const userId = service.getUserId();

      expect(userId).toBe('123');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('deve retornar null se o token estiver expirado', () => {
      const mockToken = 'mockToken';
      const expiredPayload = {
        exp: Date.now() / 1000 - 60,
      };

      mockLocalStorage.getItem.mockReturnValue(mockToken);
      (jwtDecode as jest.Mock).mockReturnValue(expiredPayload);

      const userId = service.getUserId();

      expect(userId).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('deve retornar null se o token for inválido', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const userId = service.getUserId();

      expect(userId).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });
  });
});
