import { Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vertical-card',
  imports: [TuiIcon, RouterLink],
  templateUrl: './vertical-card.html',
  styleUrl: './vertical-card.scss',
})
export class VerticalCard {}
