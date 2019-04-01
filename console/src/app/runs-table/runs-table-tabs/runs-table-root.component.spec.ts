import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunsTableRootComponent } from './runs-table-root.component';

describe('RunsTableTabsComponent', () => {
  let component: RunsTableRootComponent;
  let fixture: ComponentFixture<RunsTableRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunsTableRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunsTableRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
