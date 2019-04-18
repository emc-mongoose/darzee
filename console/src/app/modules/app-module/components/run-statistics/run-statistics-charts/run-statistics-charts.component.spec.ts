import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunStatisticsChartsComponent } from './run-statistics-charts.component';

describe('RunStatisticsChartsComponent', () => {
  let component: RunStatisticsChartsComponent;
  let fixture: ComponentFixture<RunStatisticsChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunStatisticsChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunStatisticsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
