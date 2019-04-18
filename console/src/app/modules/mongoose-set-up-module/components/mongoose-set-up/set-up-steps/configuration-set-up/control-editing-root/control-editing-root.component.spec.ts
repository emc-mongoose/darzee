import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationEditingRootComponent } from './control-editing-root.component';

describe('ConfigurationEditingRootComponent', () => {
  let component: ConfigurationEditingRootComponent;
  let fixture: ComponentFixture<ConfigurationEditingRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationEditingRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationEditingRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
