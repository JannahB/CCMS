import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySearchComponent } from './party-search.component';

describe('PartySearchComponent', () => {
  let component: PartySearchComponent;
  let fixture: ComponentFixture<PartySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
