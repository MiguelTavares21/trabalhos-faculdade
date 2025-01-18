import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateGroupComponent } from './create-group.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { jest } from '@jest/globals';


describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;
  let mockGroupService: jest.Mocked<GroupService>;
  let mockRouter: jest.Mocked<Router>;
  let mockLocation: jest.Mocked<Location>;

  beforeEach(async () => {
    mockGroupService = {
      createGroup: jest.fn(),
    } as unknown as jest.Mocked<GroupService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockLocation = {
      back: jest.fn(),
    } as unknown as jest.Mocked<Location>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateGroupComponent],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCreateGroup', () => {
    it('should call groupService.createGroup and navigate to /home on success', () => {
      const mockGroupDetails = {
        name: 'Test Group',
        description: 'Test Description',
        budget: 100,
      };

      component.createGroupForm.setValue(mockGroupDetails);
      mockGroupService.createGroup.mockReturnValue(of({ success: true }));

      component.onCreateGroup();

      expect(mockGroupService.createGroup).toHaveBeenCalledWith(
        mockGroupDetails
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should add an alert if the group creation fails', () => {
      const mockGroupDetails = {
        name: 'Test Group',
        description: 'Test Description',
        budget: 100,
      };

      component.createGroupForm.setValue(mockGroupDetails);
      mockGroupService.createGroup.mockReturnValue(
        throwError(() => new Error('API error'))
      );

      component.onCreateGroup();

      expect(component.alerts).toContain(
        'Erro ao criar o grupo. Tente novamente!'
      );
    });

    it('should add an alert if the form is invalid', () => {
      component.createGroupForm.setValue({
        name: '',
        description: '',
        budget: '',
      });

      component.onCreateGroup();

      expect(component.alerts).toContain(
        'Por favor, preencha todos os campos obrigatórios!'
      );
    });
  });

  describe('addAlert', () => {
    it('should add a new alert if it does not already exist', () => {
      const alertMessage = 'Test Alert';
      component.addAlert(alertMessage);

      expect(component.alerts).toContain(alertMessage);
    });

    it('should not add duplicate alerts', () => {
      const alertMessage = 'Duplicate Alert';
      component.addAlert(alertMessage);
      component.addAlert(alertMessage);

      expect(
        component.alerts.filter((alert) => alert === alertMessage).length
      ).toBe(1);
    });
  });

  describe('removeAlert', () => {
    it('should remove the specified alert from the alerts array', () => {
      const alertMessage = 'Test Alert';
      component.alerts = [alertMessage];
      component.removeAlert(alertMessage);

      expect(component.alerts).not.toContain(alertMessage);
    });
  });

  describe('close', () => {
    it('should call location.back to navigate back', () => {
      component.close();

      expect(mockLocation.back).toHaveBeenCalled();
    });
  });
});
