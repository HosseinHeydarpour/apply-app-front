import { Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-horizontal-card',
  imports: [TuiIcon],
  templateUrl: './horizontal-card.html',
  styleUrl: './horizontal-card.scss',
})
export class HorizontalCard {
  name = input.required<string>();
  image = input.required<string>();
  rating = input.required<number>();
  description = input.required<string>();
}
