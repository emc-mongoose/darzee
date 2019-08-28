import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryNodeChangingTableRowComponent } from './entry-node-changing-table-row.component';

describe('EntryNodeChangingTableRowComponent', () => {
  let component: EntryNodeChangingTableRowComponent;
  let fixture: ComponentFixture<EntryNodeChangingTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryNodeChangingTableRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryNodeChangingTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
