import { Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-profile-card',
  imports: [TuiIcon],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
  host: {
    class: 'p-8 ps-6 pl-6  block',
  },
})
export class ProfileCard {}
