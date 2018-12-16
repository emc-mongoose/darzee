import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPageRootComponent } from './control-page-root.component';

describe('ControlPageRootComponent', () => {
  let component: ControlPageRootComponent;
  let fixture: ComponentFixture<ControlPageRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPageRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPageRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
