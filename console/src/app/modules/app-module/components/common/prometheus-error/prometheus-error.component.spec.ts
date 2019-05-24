import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusErrorComponent } from './prometheus-error.component';

describe('PrometheusErrorComponent', () => {
  let component: PrometheusErrorComponent;
  let fixture: ComponentFixture<PrometheusErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrometheusErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrometheusErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
