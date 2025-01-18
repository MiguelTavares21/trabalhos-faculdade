import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { jest } from '@jest/globals';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockUserService = {
      getUserGroups: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<UserService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization and data loading', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should load user groups on initialization', () => {
      const mockGroups = [
        {
          id: 1,
          name: 'Test Group 1',
          description: 'Description1',
          access_code: true,
          budget: 1,
        },
        {
          id: 2,
          name: 'Test Group 2',
          description: 'Description2',
          access_code: false,
          budget: 2,
        },
      ];
      mockUserService.getUserGroups.mockReturnValue(of(mockGroups));

      component.ngOnInit();

      expect(mockUserService.getUserGroups).toHaveBeenCalled();
      expect(component.groups).toEqual(mockGroups);
    });

  });

  describe('Navigation', () => {
      it('should navigate to group details and store group ID in localStorage', () => {
    const groupId = '123';


    const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');


    component.navigateToGroup(groupId);


    expect(localStorageSpy).toHaveBeenCalledWith('selectedGroupId', groupId);
    

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/group']);
  });

    it('should navigate to the initial page', () => {
      component.navigateToInitialPage();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/initialPage']);
    });
  });
});
