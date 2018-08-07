import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCountsComponent } from './case-counts.component';

describe('CaseCountsComponent', () => {
  let component: CaseCountsComponent;
  let fixture: ComponentFixture<CaseCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseCountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
