import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalFacilitiesComponent } from './cal-facilities.component';

describe('CalFacilitiesComponent', () => {
  let component: CalFacilitiesComponent;
  let fixture: ComponentFixture<CalFacilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalFacilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
