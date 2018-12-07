import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEditingRootComponent } from './control-editing-root.component';

describe('ControlEditingRootComponent', () => {
  let component: ControlEditingRootComponent;
  let fixture: ComponentFixture<ControlEditingRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlEditingRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlEditingRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
