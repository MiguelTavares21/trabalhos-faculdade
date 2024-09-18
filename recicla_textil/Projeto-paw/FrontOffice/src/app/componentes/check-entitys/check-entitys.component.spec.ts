import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckEntitysComponent } from './check-entitys.component';

describe('CheckEntitysComponent', () => {
  let component: CheckEntitysComponent;
  let fixture: ComponentFixture<CheckEntitysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckEntitysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckEntitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
