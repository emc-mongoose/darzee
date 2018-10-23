import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTabsComponent } from './control-tabs.component';

describe('ControlTabsComponent', () => {
  let component: ControlTabsComponent;
  let fixture: ComponentFixture<ControlTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
