import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValesComponent } from './vales.component';

describe('ValesComponent', () => {
  let component: ValesComponent;
  let fixture: ComponentFixture<ValesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
