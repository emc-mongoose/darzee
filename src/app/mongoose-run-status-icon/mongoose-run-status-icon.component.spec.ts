import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MongooseRunStatusIconComponent } from './mongoose-run-status-icon.component';

describe('MongooseRunStatusIconComponent', () => {
  let component: MongooseRunStatusIconComponent;
  let fixture: ComponentFixture<MongooseRunStatusIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MongooseRunStatusIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MongooseRunStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
