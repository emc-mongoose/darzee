import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpFooterComponent } from './set-up-footer.component';

describe('SetUpFooterComponent', () => {
  let component: SetUpFooterComponent;
  let fixture: ComponentFixture<SetUpFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetUpFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
