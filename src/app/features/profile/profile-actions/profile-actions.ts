import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-profile-actions',
  imports: [TuiIcon, RouterLink],
  templateUrl: './profile-actions.html',
  styleUrl: './profile-actions.scss',
  host: {
    class: 'p-2 ps-6 pl-6  block',
  },
})
export class ProfileActions {}
