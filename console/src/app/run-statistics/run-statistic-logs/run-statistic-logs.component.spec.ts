import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunStatisticLogsComponent } from './run-statistic-logs.component';

describe('RunStatisticLogsComponent', () => {
  let component: RunStatisticLogsComponent;
  let fixture: ComponentFixture<RunStatisticLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunStatisticLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunStatisticLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
