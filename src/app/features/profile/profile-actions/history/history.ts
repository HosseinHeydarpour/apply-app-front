import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-history',
  imports: [TuiIcon, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  host: {
    class: 'p-4 ps-5 pl-5  block',
  },
})
export class History {}
