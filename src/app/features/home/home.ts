import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { VerticalCard } from '../../shared/components/vertical-card/vertical-card';
import { HorizontalCard } from '../../shared/components/horizontal-card/horizontal-card';
import { UniversityService } from '../../core/services/university-service';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-home',
  imports: [TuiCarousel, NgFor, VerticalCard, HorizontalCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected index = 0;
  protected universityService = inject(UniversityService);
  universities: any[] = [];
  baseURL = environment.baseUrl;
  imagePath = `${this.baseURL}/images/`;

  protected readonly items = [
    'angular.svg',
    'avatar.jpg',
    'angular.svg',
    'avatar.jpg',
    'angular.svg',
    'avatar.jpg',
  ];

  ngOnInit(): void {
    this.universityService.getAllUniversities().subscribe((res) => {
      console.log(res);
      this.universities = res;
    });
  }

  createImagePath(uniName: string) {
    return `${this.imagePath}${uniName}`;
  }
}
