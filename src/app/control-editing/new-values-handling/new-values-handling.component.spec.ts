import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewValuesHandlingComponent } from './new-values-handling.component';

describe('NewValuesHandlingComponent', () => {
  let component: NewValuesHandlingComponent;
  let fixture: ComponentFixture<NewValuesHandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewValuesHandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewValuesHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
