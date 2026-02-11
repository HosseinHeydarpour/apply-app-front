import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { VerticalCard } from '../../shared/components/vertical-card/vertical-card';
import { HorizontalCard } from '../../shared/components/horizontal-card/horizontal-card';
import { UniversityService } from '../../core/services/university-service';
import { environment } from '../../../environments/environment.development';
import { AgencyService } from '../../core/services/agency-service';
@Component({
  selector: 'app-home',
  imports: [TuiCarousel, NgFor, VerticalCard, HorizontalCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected index = 0;
  protected universityService = inject(UniversityService);
  protected agencyService = inject(AgencyService);
  universities: any[] = [];
  agencies: any[] = [];
  baseURL = environment.baseUrl;
  imagePath = `${this.baseURL}/images/`;

  ngOnInit(): void {
    this.universityService.getTopUnis().subscribe((res) => {
      console.log(res);
      this.universities = res;
    });
    this.agencyService.getAgencies().subscribe((res) => {
      this.agencies = res;
    });
  }

  createImagePath(uniName: string) {
    return `${this.imagePath}${uniName}`;
  }
}
