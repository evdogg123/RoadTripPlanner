import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtripComponent } from './subtrip.component';

describe('SubtripComponent', () => {
  let component: SubtripComponent;
  let fixture: ComponentFixture<SubtripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
