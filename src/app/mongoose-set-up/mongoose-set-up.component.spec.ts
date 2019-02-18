import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MongooseSetUpComponent } from './mongoose-set-up.component';

describe('MongooseSetUpComponent', () => {
  let component: MongooseSetUpComponent;
  let fixture: ComponentFixture<MongooseSetUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MongooseSetUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MongooseSetUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
