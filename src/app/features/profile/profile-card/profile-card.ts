import { Component, inject } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-profile-card',
  imports: [TuiIcon, RouterLink, CommonModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
  host: {
    class: 'p-8 ps-6 pl-6  block',
  },
})
export class ProfileCard {
  protected userService = inject(UserService);
  user: any;

  ngOnInit(): void {
    this.userService.getUser().subscribe((res) => {
      this.user = res;
      console.log(this.user);
    });
  }
}
