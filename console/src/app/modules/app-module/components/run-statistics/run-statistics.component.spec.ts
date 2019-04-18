import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunStatisticsComponent } from './run-statistics.component';

describe('RunStatisticsComponent', () => {
  let component: RunStatisticsComponent;
  let fixture: ComponentFixture<RunStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
