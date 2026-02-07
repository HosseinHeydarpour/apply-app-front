import { Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  imports: [TuiIcon, RouterLink, CommonModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
  host: {
    class: 'p-8 ps-6 pl-6  block',
  },
})
export class ProfileCard {}
