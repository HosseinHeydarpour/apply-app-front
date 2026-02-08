import { NgFor, NgClass, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';

@Component({
  selector: 'app-explore',
  imports: [NgFor, TuiCarousel, CommonModule],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})
export class Explore {
  // 1. Track the carousel scroll position
  protected index = 0;

  // 2. Track the currently active/selected country (default to 'All')
  protected selectedCountry = 'All';

  // 3. Data source: You can replace the flag URLs with your local assets
  protected readonly items = [
    { name: 'همه', flag: null }, // All
    { name: 'آمریکا', flag: 'https://flagcdn.com/w40/us.png' }, // USA
    { name: 'فرانسه', flag: 'https://flagcdn.com/w40/fr.png' }, // France
    { name: 'آلمان', flag: 'https://flagcdn.com/w40/de.png' }, // Germany
    { name: 'ایتالیا', flag: 'https://flagcdn.com/w40/it.png' }, // Italy
    { name: 'ژاپن', flag: 'https://flagcdn.com/w40/jp.png' }, // Japan
    { name: 'اسپانیا', flag: 'https://flagcdn.com/w40/es.png' }, // Spain
  ];

  protected select(name: string): void {
    this.selectedCountry = name;
  }
}
