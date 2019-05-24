import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryNodeSelectionComponent } from './entry-node-selection.component';

describe('EntryNodeSelectionComponent', () => {
  let component: EntryNodeSelectionComponent;
  let fixture: ComponentFixture<EntryNodeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryNodeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryNodeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
