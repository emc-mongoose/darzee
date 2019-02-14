import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunsTableComponent } from './runs-table.component';

describe('RunsTableComponent', () => {
  let component: RunsTableComponent;
  let fixture: ComponentFixture<RunsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
