import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraAbajoComponent } from './barra-abajo.component';

describe('BarraAbajoComponent', () => {
  let component: BarraAbajoComponent;
  let fixture: ComponentFixture<BarraAbajoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarraAbajoComponent]
    });
    fixture = TestBed.createComponent(BarraAbajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
