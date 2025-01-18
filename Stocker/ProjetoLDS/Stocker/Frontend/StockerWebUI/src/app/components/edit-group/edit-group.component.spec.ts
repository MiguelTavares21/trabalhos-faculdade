import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditGroupComponent } from './edit-group.component';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Group } from '../../models/group';
import { AlertComponent } from '../alert/alert.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Corrigido para importar corretamente
import { jest } from '@jest/globals';

describe('EditGroupComponent', () => {
  let component: EditGroupComponent;
  let fixture: ComponentFixture<EditGroupComponent>;
  let mockGroupService: jest.Mocked<GroupService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockGroupService = {
      getGroup: jest.fn().mockReturnValue(of()),
      editGroup: jest.fn(),
    } as unknown as jest.Mocked<GroupService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AlertComponent,
        HttpClientTestingModule,
        EditGroupComponent,
      ],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization and form loading', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form and load group data', () => {
      const mockGroup: Group = {
        id: 1,
        name: 'Test Group',
        description: 'Test Description',
        access_code: true,
        budget: 100,
      };
      const groupId = 1;

      localStorage.setItem('selectedGroupId', groupId.toString());
      mockGroupService.getGroup.mockReturnValue(of(mockGroup));

      component.ngOnInit();

      expect(mockGroupService.getGroup).toHaveBeenCalledWith(groupId);
      expect(component.grupo).toEqual(mockGroup);
      expect(component.editForm.value).toEqual({
        name: mockGroup.name,
        description: mockGroup.description,
        budget: mockGroup.budget,
      });
    });

    it('should add an alert if group data fails to load', () => {
      localStorage.setItem('selectedGroupId', '1');

      mockGroupService.getGroup.mockReturnValueOnce(
        throwError(() => new Error('Error'))
      );

      component.ngOnInit();

      expect(component.alerts).toContain(
        'Ocorreu um erro ao carregar as informações do grupo!'
      );
    });


    it('should handle missing selectedGroupId and show an alert', () => {
      localStorage.removeItem('selectedGroupId');
      component.ngOnInit();

      expect(component.alerts).toContain(
        'Ocorreu um erro! Não foi possível identificar o grupo.'
      );
    });
  });

  describe('Form submission and edit group', () => {
    it('should call confirmEditGroup and update the group', () => {
      const mockGroup: Group = {
        id: 1,
        name: 'Test Group',
        description: 'Test Description',
        access_code: true,
        budget: 100,
      };
      const updatedGroup = {
        name: 'Updated Group',
        description: 'Updated Description',
        budget: 150,
      };
      localStorage.setItem('selectedGroupId', '1');

      component.editForm.setValue(updatedGroup);
      mockGroupService.editGroup.mockReturnValue(of(mockGroup));

      component.confirmEditGroup();

      expect(mockGroupService.editGroup).toHaveBeenCalledWith(1, updatedGroup);
      expect(component.alerts).toContain('Grupo atualizada com sucesso.');
    });

    it('should add an alert if form is invalid', () => {
      component.editForm.setValue({
        name: '',
        description: '',
        budget: 0,
      });

      component.confirmEditGroup();

      expect(component.alerts).toContain(
        'Preencha todos os campos obrigatórios!'
      );
    });

    it('should add an alert if editing group fails', () => {
      const updatedGroup = {
        name: 'Updated Group',
        description: 'Updated Description',
        budget: 150,
      };
      localStorage.setItem('selectedGroupId', '1');

      component.editForm.setValue(updatedGroup);
      mockGroupService.editGroup.mockReturnValue(
        throwError(() => new Error('Error'))
      );

      component.confirmEditGroup();

      expect(component.alerts).toContain('Ocorreu um erro ao editar o grupo!');
    });
  });
});
