import { Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-history',
  imports: [TuiIcon],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  host: {
    class: 'p-4 ps-5 pl-5  block',
  },
})
export class History {}
