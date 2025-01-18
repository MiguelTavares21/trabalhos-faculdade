import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupComponent } from './group.component';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { fakeAsync, tick } from '@angular/core/testing';
import { jest } from '@jest/globals';

describe('GroupComponent', () => {
  let component: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;
  let mockGroupService: jest.Mocked<GroupService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockGroupService = {
      getGroup: jest.fn(),
      getGroupUsers: jest.fn(),
      getUserRole: jest.fn(),
      leaveGroup: jest.fn(() => of<void>()),
      deleteGroup: jest.fn(() => of<void>()),
      changeRole: jest.fn(() => of<void>()),
      removeMember: jest.fn(() => of<void>()),
    } as unknown as jest.Mocked<GroupService>;

    mockAuthService = {
      getUserId: jest.fn().mockReturnValue('1'),
    } as unknown as jest.Mocked<AuthService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, GroupComponent],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupComponent);
    component = fixture.componentInstance;
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load group details, users, and user role', () => {
      const groupData = {
        id: 1,
        name: 'Test Group',
        description: 'Description',
        access_code: true,
        budget: 123
      };
      const usersData = [{ id: 1, name: 'User 1', role: 1, email: "123@gmail.com", notifications: true }];
      const roleData = { role: 'Admin' };

      mockGroupService.getGroup.mockReturnValue(of(groupData));
      mockGroupService.getGroupUsers.mockReturnValue(of(usersData));
      mockGroupService.getUserRole.mockReturnValue(of(roleData));

      component.ngOnInit();

      expect(mockGroupService.getGroup).toHaveBeenCalledWith(1);
      expect(component.group).toEqual(groupData);
      expect(component.users).toEqual(usersData);
      expect(component.userRole).toBe('Admin');
    });

    it('should handle missing group ID in localStorage', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);
      component.ngOnInit();

      expect(component.error).toBe(
        'ID do grupo não encontrado em localStorage!'
      );
    });
  });

describe('leaveGroup', () => {
  it('should leave the group successfully', fakeAsync(() => {
    const groupId = 1;
    jest.spyOn(localStorage, 'getItem').mockReturnValue(groupId.toString());
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');

    mockGroupService.leaveGroup.mockReturnValue(of(void 0));

    component.leaveGroup();
    tick();

    expect(mockGroupService.leaveGroup).toHaveBeenCalledWith(groupId);
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  }));


  it('should handle error when leaving the group', fakeAsync(() => {
    const groupId = 1;
    jest.spyOn(localStorage, 'getItem').mockReturnValue(groupId.toString());
    mockGroupService.leaveGroup.mockReturnValue(
      throwError(() => new Error('Failed to leave the group'))
    );
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.leaveGroup();
    tick();

    expect(mockGroupService.leaveGroup).toHaveBeenCalledWith(groupId);
    expect(window.alert).toHaveBeenCalledWith(
      'Não foi possível sair do grupo. Tente novamente.'
    );
  }));

});

  describe('changeRole', () => {
    it('should change the role and refresh user list', fakeAsync(() => {
      const groupId = 1;
      const userId = 1;
      jest.spyOn(localStorage, 'getItem').mockReturnValue(groupId.toString());
      jest.spyOn(component, 'fetchGroupUsers'); 

      mockGroupService.changeRole.mockReturnValue(of(void 0));
      mockGroupService.getGroupUsers.mockReturnValue(of([]));

      component.changeRole(userId);
      tick();

      expect(mockGroupService.changeRole).toHaveBeenCalledWith(groupId, userId);
      expect(component.fetchGroupUsers).toHaveBeenCalledWith(groupId);
    }));


  });

  describe('confirmAction', () => {
    it('should execute leave group action on confirmation', () => {
      jest.spyOn(component, 'leaveGroup');
      component.modalType = 'leave';

      component.confirmAction(true);

      expect(component.leaveGroup).toHaveBeenCalled();
      expect(component.showModal).toBe(false);
    });

    it('should execute delete group action on confirmation', () => {
      jest.spyOn(component, 'deleteGroup');
      component.modalType = 'delete';

      component.confirmAction(true);

      expect(component.deleteGroup).toHaveBeenCalled();
      expect(component.showModal).toBe(false);
    });
  });
});
