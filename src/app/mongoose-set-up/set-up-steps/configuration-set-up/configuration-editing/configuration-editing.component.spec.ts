import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationEditingComponent } from './configuration-editing.component';


describe('ConfigurationEditingComponent', () => {
  let component: ConfigurationEditingComponent;
  let fixture: ComponentFixture<ConfigurationEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
