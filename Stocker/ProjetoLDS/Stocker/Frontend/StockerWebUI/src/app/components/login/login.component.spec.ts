import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importando o HttpClientTestingModule
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { jest } from '@jest/globals';
import { UserService } from '../../services/user.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockUserService: jest.Mocked<UserService>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn().mockReturnValue(of({ token: 'mockToken' })),
      setToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockUserService = {
      joinGroup: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<UserService>;

    mockActivatedRoute = {
      snapshot: { queryParams: {} },
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        AlertComponent,
        LoginComponent,
        HttpClientTestingModule, // Aqui você adiciona o HttpClientTestingModule
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
