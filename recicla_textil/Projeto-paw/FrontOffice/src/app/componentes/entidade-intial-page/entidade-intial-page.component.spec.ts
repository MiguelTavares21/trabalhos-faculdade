import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadeIntialPageComponent } from './entidade-intial-page.component';

describe('EntidadeIntialPageComponent', () => {
  let component: EntidadeIntialPageComponent;
  let fixture: ComponentFixture<EntidadeIntialPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntidadeIntialPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntidadeIntialPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
