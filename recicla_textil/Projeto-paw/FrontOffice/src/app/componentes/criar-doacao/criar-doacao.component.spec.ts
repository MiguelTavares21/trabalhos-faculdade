import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarDoacaoComponent } from './criar-doacao.component';

describe('CriarDoacaoComponent', () => {
  let component: CriarDoacaoComponent;
  let fixture: ComponentFixture<CriarDoacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarDoacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarDoacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
