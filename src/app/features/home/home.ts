import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { VerticalCard } from '../../shared/components/vertical-card/vertical-card';
import { HorizontalCard } from '../../shared/components/horizontal-card/horizontal-card';
@Component({
  selector: 'app-home',
  imports: [TuiCarousel, NgFor, VerticalCard, HorizontalCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected index = 0;

  protected readonly items = [
    'angular.svg',
    'avatar.jpg',
    'angular.svg',
    'avatar.jpg',
    'angular.svg',
    'avatar.jpg',
  ];
}
