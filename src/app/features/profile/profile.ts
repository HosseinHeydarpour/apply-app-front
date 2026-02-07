import { Component } from '@angular/core';
import { ProfileCard } from './profile-card/profile-card';
import { ProfileActions } from './profile-actions/profile-actions';

@Component({
  selector: 'app-profile',
  imports: [ProfileCard, ProfileActions],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {}
