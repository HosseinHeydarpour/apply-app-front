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

  // لیست اصلی که همیشه تمام دیتا را دارد
  allUniversities: any[] = [];
  // لیستی که در صفحه نمایش داده می‌شود (فیلتر شده)
  filteredUniversities: any[] = [];

  // کد کشور انتخاب شده (برای استایل دهی دکمه فعال)
  protected selectedCode: string | null = null;

  // 3. Data source: You can replace the flag URLs with your local assets
  protected readonly items = [
    { name: 'همه', code: null, flag: null },
    { name: 'آمریکا', code: 'US', flag: 'https://flagcdn.com/w40/us.png' },
    { name: 'کانادا', code: 'CA', flag: 'https://flagcdn.com/w40/ca.png' },
    { name: 'انگلستان', code: 'GB', flag: 'https://flagcdn.com/w40/gb.png' },
    { name: 'سوئیس', code: 'CH', flag: 'https://flagcdn.com/w40/ch.png' },
    { name: 'آلمان', code: 'DE', flag: 'https://flagcdn.com/w40/de.png' },
    { name: 'استرالیا', code: 'AU', flag: 'https://flagcdn.com/w40/au.png' },
  ];

  ngOnInit(): void {
    const data = this.route.snapshot.data['exploreData'];
    this.allUniversities = data;
    this.filteredUniversities = data;
  }

  createImagePath(uniName: string) {
    return `${this.imagePath}${uniName}`;
  }

  protected select(code: string | null): void {
    this.selectedCode = code;

    if (code === null) {
      // اگر "همه" انتخاب شد، لیست کامل را برگردان
      this.filteredUniversities = this.allUniversities;
    } else {
      // در غیر این صورت بر اساس کد کشور فیلتر کن
      this.filteredUniversities = this.allUniversities.filter((uni) => uni.country === code);
    }
  }
}
