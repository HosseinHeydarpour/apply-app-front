import { Component } from '@angular/core';
import { ProfileCard } from './profile-card/profile-card';

@Component({
  selector: 'app-profile',
  imports: [ProfileCard],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {}
