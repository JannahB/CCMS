import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAutocompleteComponent } from './custom-autocomplete.component';
import { AppModule } from '../../../app.module';

describe('CustomAutocompleteComponent', () => {
  let component: CustomAutocompleteComponent;
  let fixture: ComponentFixture<CustomAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(CustomAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
