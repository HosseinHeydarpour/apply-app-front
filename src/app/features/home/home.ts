import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { VerticalCard } from '../../shared/components/vertical-card/vertical-card';
import { HorizontalCard } from '../../shared/components/horizontal-card/horizontal-card';
import { UniversityService } from '../../core/services/university-service';
import { environment } from '../../../environments/environment.development';
import { AgencyService } from '../../core/services/agency-service';
import { ActivatedRoute } from '@angular/router';
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
  ads: any[] = [];
  baseURL = environment.baseUrl;
  imagePath = `${this.baseURL}/images/`;
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const data = this.route.snapshot.data['homeData'];
    this.universities = data.universities;
    this.agencies = data.agencies;
    this.ads = data.ads;

    console.log(this.universities, this.agencies, this.ads);
  }

  createImagePath(uniName: string) {
    return `${this.imagePath}${uniName}`;
  }
}
