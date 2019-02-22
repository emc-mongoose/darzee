import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlNavbarComponent } from './control-navbar.component';

describe('ControlNavbarComponent', () => {
  let component: ControlNavbarComponent;
  let fixture: ComponentFixture<ControlNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
