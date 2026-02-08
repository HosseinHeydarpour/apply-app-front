import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { VerticalCard } from '../../shared/components/vertical-card/vertical-card';
@Component({
  selector: 'app-home',
  imports: [TuiCarousel, NgFor, VerticalCard],
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
