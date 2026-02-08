import { ComponentFixture, TestBed } from '@angular/core/testing';

import { University } from './university';

describe('University', () => {
  let component: University;
  let fixture: ComponentFixture<University>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [University]
    })
    .compileComponents();

    fixture = TestBed.createComponent(University);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
