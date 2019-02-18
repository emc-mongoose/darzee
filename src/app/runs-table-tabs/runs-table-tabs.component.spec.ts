import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunsTableTabsComponent } from './runs-table-tabs.component';

describe('RunsTableTabsComponent', () => {
  let component: RunsTableTabsComponent;
  let fixture: ComponentFixture<RunsTableTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunsTableTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunsTableTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
