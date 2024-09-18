import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDonationsComponent } from './check-donations.component';

describe('CheckDonationsComponent', () => {
  let component: CheckDonationsComponent;
  let fixture: ComponentFixture<CheckDonationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckDonationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
