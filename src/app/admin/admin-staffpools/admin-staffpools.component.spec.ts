import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStaffPoolComponent } from './admin-staffpools.component';

describe('AdminStaffPoolComponent', () => {
  let component: AdminStaffPoolComponent;
  let fixture: ComponentFixture<AdminStaffPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminStaffPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStaffPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
