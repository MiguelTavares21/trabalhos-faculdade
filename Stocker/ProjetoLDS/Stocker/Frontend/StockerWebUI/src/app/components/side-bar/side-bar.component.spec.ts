import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../models/user';
import { jest } from '@jest/globals';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockUserService: jest.Mocked<UserService>;
  let router: Router;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    notifications: true,
  };

  beforeEach(async () => {
    mockAuthService = {
      getUserId: jest.fn().mockReturnValue('1'),
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockUserService = {
      getUserById: jest.fn().mockReturnValue(of(mockUser)),
      editAccount: jest.fn().mockReturnValue(of(mockUser)),
    } as unknown as jest.Mocked<UserService>;

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), SideBarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    component.ngOnInit();
    expect(mockAuthService.getUserId).toHaveBeenCalled();
    expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
    expect(component.userEmail).toBe('john.doe@example.com');
    expect(component.userName).toBe('John Doe');
    expect(component.loading).toBe(false);
  });

  it('should toggle notifications for the user', () => {
    const initialNotifications = mockUser.notifications;
    component.toggleNotifications();
    expect(mockUserService.editAccount).toHaveBeenCalledWith(mockUser);
    expect(mockUser.notifications).toBe(!initialNotifications);
  });

  it('should call logout and navigate to login', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
