import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { AgencyService } from '../../core/services/agency-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-agency',
  imports: [NgFor, TuiButton, TuiCarousel, TuiPagination, RouterLink],
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
})
export class Agency implements OnInit {
  protected index = 0;

  protected route = inject(ActivatedRoute);
  protected agencyService = inject(AgencyService);
  agency: any;
  baseURL = environment.baseUrl;
  authService = inject(Auth);
  ngOnInit(): void {
    this.agency = this.route.snapshot.data['agency'];
    console.log(this.agency);
  }

  createImagePath(imageName: string) {
    return `${this.baseURL}/images/${imageName}`;
  }
}
