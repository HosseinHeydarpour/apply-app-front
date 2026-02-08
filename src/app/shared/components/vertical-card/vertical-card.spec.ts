import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalCard } from './vertical-card';

describe('VerticalCard', () => {
  let component: VerticalCard;
  let fixture: ComponentFixture<VerticalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
