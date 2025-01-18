import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { CommonModule } from '@angular/common';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;

    component.alerts = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    describe('Input handling', () => {      

      it('should handle empty alert list as input', () => {
        expect(component.alerts.length).toEqual(0);
      });

      it('should correctly assign alerts via @Input', () => {
        const mockAlerts = ['Alert 1', 'Alert 2', 'Alert 3'];

        component.alerts = mockAlerts;
        fixture.detectChanges();

        expect(component.alerts).toEqual(mockAlerts);
      });
    });

  describe('onRemoveAlert', () => {
    it('should emit alertClosed with the removed alert text', () => {
      let alertClosedValue = '';
      component.alertClosed.subscribe((alert) => {
        alertClosedValue = alert;
      });
      
      const alertToRemove = 'Test alert 1';
      component.onRemoveAlert(alertToRemove);

      expect(alertClosedValue).toBe(alertToRemove);
    });
  });
});
