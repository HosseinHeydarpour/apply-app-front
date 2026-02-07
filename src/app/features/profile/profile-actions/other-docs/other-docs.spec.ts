import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDocs } from './other-docs';

describe('OtherDocs', () => {
  let component: OtherDocs;
  let fixture: ComponentFixture<OtherDocs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherDocs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherDocs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
