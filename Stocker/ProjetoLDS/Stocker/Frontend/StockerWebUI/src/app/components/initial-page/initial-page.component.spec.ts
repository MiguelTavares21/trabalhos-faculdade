import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialPageComponent } from './initial-page.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jest } from '@jest/globals';

describe('InitialPageComponent', () => {
  let component: InitialPageComponent;
  let fixture: ComponentFixture<InitialPageComponent>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, InitialPageComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(InitialPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openPopup', () => {
    it('should open the popup', () => {
      component.openPopup();
      expect(component.isPopupOpen).toBe(true);
    });
  });

  describe('closePopup', () => {
    it('should close the popup', () => {
      component.closePopup();
      expect(component.isPopupOpen).toBe(false);
    });
  });

  describe('goToCreateGroup', () => {
    it('should navigate to the create group page', () => {
      component.goToCreateGroup();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/createGroup']);
    });
  });
});
