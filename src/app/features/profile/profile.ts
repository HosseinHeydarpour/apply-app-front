import { Component, inject, OnInit } from '@angular/core';
import { ProfileCard } from './profile-card/profile-card';
import { ProfileActions } from './profile-actions/profile-actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [ProfileCard, ProfileActions],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private route = inject(ActivatedRoute);
  userData: any;

  ngOnInit() {
    // 2. ACCESS PARENT DATA
    // We use .parent because the resolver is attached to the route above this one
    this.userData = this.route.parent?.snapshot.data['user'];
  }
}
