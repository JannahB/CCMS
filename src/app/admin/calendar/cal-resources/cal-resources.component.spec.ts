import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalResourcesComponent } from './cal-resources.component';

describe('CalResourcesComponent', () => {
  let component: CalResourcesComponent;
  let fixture: ComponentFixture<CalResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
