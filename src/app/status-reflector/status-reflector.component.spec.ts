import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusReflectorComponent } from './status-reflector.component';

describe('StatusReflectorComponent', () => {
  let component: StatusReflectorComponent;
  let fixture: ComponentFixture<StatusReflectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusReflectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusReflectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
