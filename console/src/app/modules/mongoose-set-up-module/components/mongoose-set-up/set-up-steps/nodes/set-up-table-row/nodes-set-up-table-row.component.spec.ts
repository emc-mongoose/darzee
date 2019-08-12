import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesSetUpTableRowComponent } from './nodes-set-up-table-row.component';

describe('NodesSetUpTableRowComponent', () => {
  let component: NodesSetUpTableRowComponent;
  let fixture: ComponentFixture<NodesSetUpTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesSetUpTableRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesSetUpTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
