import { NgFor, NgClass, CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { VerticalCard } from '../../shared/components/vertical-card/vertical-card';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-explore',
  imports: [NgFor, TuiCarousel, CommonModule, VerticalCard, RouterLink],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})
export class Explore implements OnInit {
  // 1. Track the carousel scroll position
  protected index = 0;
  protected route = inject(ActivatedRoute);
  baseUrl = environment.baseUrl;
  imagePath = `${this.baseUrl}/images/`;
  universities: any[] = [];

  // 2. Track the currently active/selected country (default to 'All')
  protected selectedCountry = 'All';

  // 3. Data source: You can replace the flag URLs with your local assets
  protected readonly items = [
    { name: 'همه', flag: null }, // All
    { name: 'آمریکا', flag: 'https://flagcdn.com/w40/us.png' }, // USA
    { name: 'کانادا', flag: 'https://flagcdn.com/w40/ca.png' }, // Canada
    { name: 'انگلستان', flag: 'https://flagcdn.com/w40/gb.png' }, // UK
    { name: 'سوئیس', flag: 'https://flagcdn.com/w40/ch.png' }, // Switzerland
    { name: 'آلمان', flag: 'https://flagcdn.com/w40/de.png' }, // Germany
    { name: 'استرالیا', flag: 'https://flagcdn.com/w40/au.png' }, // Australia
  ];

  ngOnInit(): void {
    const data = this.route.snapshot.data['exploreData'];
    this.universities = data;
    console.log(this.universities);
  }

  createImagePath(uniName: string) {
    return `${this.imagePath}${uniName}`;
  }

  protected select(name: string): void {
    this.selectedCountry = name;
  }
}
