import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditingScenariosComponent } from './editing-scenarios.component';

describe('EditingScenariosComponent', () => {
  let component: EditingScenariosComponent;
  let fixture: ComponentFixture<EditingScenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditingScenariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditingScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
