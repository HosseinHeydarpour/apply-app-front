import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalCard } from './horizontal-card';

describe('HorizontalCard', () => {
  let component: HorizontalCard;
  let fixture: ComponentFixture<HorizontalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
