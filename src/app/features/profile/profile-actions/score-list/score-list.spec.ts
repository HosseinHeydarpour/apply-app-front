import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreList } from './score-list';

describe('ScoreList', () => {
  let component: ScoreList;
  let fixture: ComponentFixture<ScoreList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
