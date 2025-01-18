import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../environments/environment.development';
import { Group } from '../models/group';
import { User } from '../models/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUserGroups', () => {
    it('deve retornar grupos do usuário', () => {
      const mockGroups: Group[] = [
        { id: 1, name: 'Group 1', description:"123", access_code:true, budget:123 },
      ];

      service.getUserGroups().subscribe((groups) => {
        expect(groups).toEqual(mockGroups);
      });

      const req = httpMock.expectOne(`${apiUrl}/Users/getGroups`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGroups);
    });
  });

  describe('getUserById', () => {
    it('deve retornar os detalhes do usuário', () => {
      const userId = 1;
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        notifications: true
      };

      service.getUserById(userId).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/Users/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('joinGroup', () => {
    it('deve permitir que o usuário entre em um grupo', () => {
      const accessCode = 'abc123';

      service.joinGroup(accessCode).subscribe((response) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/Users/join-group`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(JSON.stringify(accessCode));
      req.flush({});
    });
  });

  describe('editAccount', () => {
    it('deve editar os dados do usuário', () => {
      const account = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        notifications: true,
      };
      const mockUser: User = {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
        notifications: true
      };

      service.editAccount(account).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/Users/edit-account`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(account);
      req.flush(mockUser);
    });
  });

  describe('changePass', () => {
    it('deve alterar a senha do usuário', () => {
      const passes = { passAtual: 'oldPass', novaPass: 'newPass' };

      service.changePass(passes).subscribe((response) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/Users/change-password`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(passes);
      req.flush({});
    });
  });
});
