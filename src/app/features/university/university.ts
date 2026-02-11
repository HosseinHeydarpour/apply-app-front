import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { environment } from '../../../environments/environment.development';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-university',
  imports: [NgFor, TuiButton, TuiCarousel, TuiPagination, RouterLink],
  templateUrl: './university.html',
  styleUrl: './university.scss',
})
export class University implements OnInit {
  protected index = 0;
  route = inject(ActivatedRoute);
  university: any;
  baseURL = environment.baseUrl;
  authService = inject(Auth);

  ngOnInit(): void {
    this.university = this.route.snapshot.data['university'];
    console.log(this.university);
  }

  createImagePath(imageName: string) {
    return `${this.baseURL}/images/${imageName}`;
  }
}
