import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIntialPageComponent } from './user-intial-page.component';

describe('UserIntialPageComponent', () => {
  let component: UserIntialPageComponent;
  let fixture: ComponentFixture<UserIntialPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIntialPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserIntialPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
