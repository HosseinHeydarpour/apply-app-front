import { Component, inject, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user-service';
import { environment } from '../../../../environments/environment.development';

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
  user = input<any>();

  baseURL = environment.baseUrl;

  createImagePath(imageName: string) {
    return `${this.baseURL}/images/${imageName}`;
  }
}
