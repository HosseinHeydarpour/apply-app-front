import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-horizontal-card',
  imports: [TuiIcon, RouterLink],
  templateUrl: './horizontal-card.html',
  styleUrl: './horizontal-card.scss',
})
export class HorizontalCard {
  name = input.required<string>();
  image = input.required<string>();
  rating = input.required<number>();
  description = input.required<string>();
  destination = input.required<string>();
  id = input<number | string>();
}
