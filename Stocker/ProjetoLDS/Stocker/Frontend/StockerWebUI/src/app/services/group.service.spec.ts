import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { jest } from '@jest/globals';
import { GroupService } from './group.service';

jest.mock('jwt-decode');

describe('GroupService', () => {
  let service: GroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupService],
    });

    service = TestBed.inject(GroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('createGroup', () => {
    it('deve enviar uma requisição POST para criar um grupo', (done) => {
      const mockGroup = {
        name: 'Test Group',
        description: 'A test group',
        budget: 100,
      };
      const mockResponse = { id: 1, ...mockGroup };

      service.createGroup(mockGroup).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/Groups/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockGroup);
      req.flush(mockResponse);
    });
  });

  describe('getGroup', () => {
    it('deve enviar uma requisição GET para obter detalhes de um grupo', (done) => {
      const mockGroup = {
        id: 1,
        name: 'Test Group',
        description: 'A test group',
        budget: 100,
        access_code: true
      };

      service.getGroup(1).subscribe((response) => {
        expect(response).toEqual(mockGroup);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/Groups/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGroup);
    });
  });

  describe('getGroupUsers', () => {
    it('deve enviar uma requisição GET para obter os utilizadores de um grupo', (done) => {
      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          role: 1,
          email: '123@gmail.com',
          notifications: true,
        },
        {
          id: 2,
          name: 'User 2',
          role: 0,
          email: '123@gmail.com',
          notifications: true,
        },
      ];

      service.getGroupUsers(1).subscribe((response) => {
        expect(response).toEqual(mockUsers);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/Groups/1/getUsers`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('getUserRole', () => {
    it('deve enviar uma requisição GET para obter o papel de um utilizador no grupo', (done) => {
      const mockRole = { role: 'admin' };

      service.getUserRole(1, 1).subscribe((response) => {
        expect(response).toEqual(mockRole);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Groups/1/users/1/role`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockRole);
    });
  });

  describe('leaveGroup', () => {
    it('deve enviar uma requisição DELETE para o utilizador sair do grupo', (done) => {
      service.leaveGroup(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/Groups/leave/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('deleteGroup', () => {
    it('deve enviar uma requisição DELETE para excluir um grupo', (done) => {
      service.deleteGroup(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Groups/delete-group/1`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('editGroup', () => {
    it('deve enviar uma requisição PUT para editar um grupo', (done) => {
      const updatedGroup = {
        id: 1,
        name: 'Updated Group',
        description: 'Updated description',
        budget: 200,
        access_code: true
      };

      service.editGroup(1, updatedGroup).subscribe((response) => {
        expect(response).toEqual(updatedGroup);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Groups/edit-group/1`
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedGroup);
      req.flush(updatedGroup);
    });
  });

  describe('changeRole', () => {
    it('deve enviar uma requisição PUT para mudar o papel de um utilizador no grupo', (done) => {
      service.changeRole(1, 1).subscribe((response) => {
        expect(response).toEqual({});
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Groups/1/changeRole/1`
      );
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });

  describe('removeMember', () => {
    it('deve enviar uma requisição DELETE para remover um membro do grupo', (done) => {
      service.removeMember(1, 1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/Groups/1/remove-member/1`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
