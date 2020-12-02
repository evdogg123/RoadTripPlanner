import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripInfoComponent } from './edit-trip-info.component';

describe('EditTripInfoComponent', () => {
  let component: EditTripInfoComponent;
  let fixture: ComponentFixture<EditTripInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTripInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
