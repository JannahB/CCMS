import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentManagerComponent } from './assignment-manager.component';

describe('AssignmentManagerComponent', () => {
  let component: AssignmentManagerComponent;
  let fixture: ComponentFixture<AssignmentManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
