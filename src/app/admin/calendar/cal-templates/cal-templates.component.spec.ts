import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalTemplatesComponent } from './cal-templates.component';

describe('CalTemplatesComponent', () => {
  let component: CalTemplatesComponent;
  let fixture: ComponentFixture<CalTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
