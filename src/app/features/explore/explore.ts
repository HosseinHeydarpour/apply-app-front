import { NgFor, NgClass, CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { VerticalCard } from '../../shared/components/vertical-card/vertical-card';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.development';

/**
 * کامپوننت Explore (صفحه جستجو)
 *
 * این کامپوننت وظیفه نمایش لیست دانشگاه‌ها را بر عهده دارد.
 * کاربر می‌تواند با کلیک روی پرچم کشورها، لیست را فیلتر کند یا همه دانشگاه‌ها را ببیند.
 */
@Component({
  selector: 'app-explore',
  imports: [NgFor, TuiCarousel, CommonModule, VerticalCard, RouterLink],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})
export class Explore implements OnInit {
  /**
   * این متغیر موقعیت اسکرول کاروسل (Carousel) یا همان اسلایدر پرچم‌ها را نگه می‌دارد.
   * عدد 0 یعنی اسلایدر از اولین آیتم شروع می‌شود.
   */
  protected index = 0;

  /**
   * ابزاری برای دسترسی به اطلاعات مسیر (URL) فعلی.
   * ما از این برای گرفتن اطلاعاتی که قبل از باز شدن صفحه لود شده‌اند (Resolver) استفاده می‌کنیم.
   */
  protected route = inject(ActivatedRoute);

  // آدرس پایه سرور و مسیر تصاویر که از فایل تنظیمات (Environment) خوانده می‌شود
  baseUrl = environment.baseUrl;
  imagePath = `${this.baseUrl}/images/`;

  /**
   * لیست اصلی و کامل دانشگاه‌ها.
   * این لیست مثل یک "انبار" عمل می‌کند و همیشه تمام اطلاعات را بدون تغییر نگه می‌دارد
   * تا اگر کاربر فیلتر را حذف کرد، دوباره به داده‌های اصلی دسترسی داشته باشیم.
   */
  allUniversities: any[] = [];

  /**
   * لیستی که در صفحه HTML نمایش داده می‌شود.
   * وقتی کاربر فیلتر می‌کند، این لیست تغییر می‌کند اما لیست اصلی (allUniversities) دست‌نخورده باقی می‌ماند.
   */
  filteredUniversities: any[] = [];

  /**
   * کد کشوری که کاربر انتخاب کرده است.
   * اگر null باشد یعنی گزینه "همه" انتخاب شده است.
   * از این متغیر برای روشن/خاموش کردن رنگ دکمه‌ها در HTML استفاده می‌شود.
   */
  protected selectedCode: string | null = null;

  /**
   * لیست کشورهایی که در اسلایدر بالای صفحه نمایش داده می‌شوند.
   * شامل نام، کد کشور (برای فیلتر کردن) و لینک پرچم است.
   */
  protected readonly items = [
    { name: 'همه', code: null, flag: null },
    { name: 'آمریکا', code: 'US', flag: 'https://flagcdn.com/w40/us.png' },
    { name: 'کانادا', code: 'CA', flag: 'https://flagcdn.com/w40/ca.png' },
    { name: 'انگلستان', code: 'GB', flag: 'https://flagcdn.com/w40/gb.png' },
    { name: 'سوئیس', code: 'CH', flag: 'https://flagcdn.com/w40/ch.png' },
    { name: 'آلمان', code: 'DE', flag: 'https://flagcdn.com/w40/de.png' },
    { name: 'استرالیا', code: 'AU', flag: 'https://flagcdn.com/w40/au.png' },
  ];

  /**
   * متد OnInit: اولین چیزی که هنگام لود شدن صفحه اجرا می‌شود.
   * وظیفه: دریافت داده‌ها و پر کردن لیست‌های اولیه.
   */
  ngOnInit(): void {
    // 1. دریافت داده‌هایی که توسط سیستم روتینگ (Resolver) برای این صفحه آماده شده است
    // نام 'exploreData' باید با چیزی که در فایل app.routes.ts تعریف شده یکی باشد
    const data = this.route.snapshot.data['exploreData'];

    // 2. ذخیره داده‌ها در لیست "انبار" (لیست اصلی)
    this.allUniversities = data;

    // 3. در لحظه اول، چون هیچ فیلتری نداریم، لیست نمایشی را هم با تمام داده‌ها پر می‌کنیم
    this.filteredUniversities = data;
  }

  /**
   * یک تابع کمکی برای ساختن آدرس کامل تصویر دانشگاه.
   *
   * @param uniName - نام دانشگاه یا فایل تصویر
   * @returns آدرس کامل اینترنتی تصویر (مثلا: http://api.../images/harvard.jpg)
   */
  createImagePath(uniName: string) {
    return `${this.imagePath}${uniName}`;
  }

  /**
   * تابع اصلی فیلتر کردن لیست دانشگاه‌ها.
   * وقتی کاربر روی یک پرچم یا دکمه "همه" کلیک می‌کند، این تابع صدا زده می‌شود.
   *
   * @param code - کد کشور انتخاب شده (مثلاً 'US') یا null برای نمایش همه.
   */
  protected select(code: string | null): void {
    // 1. ذخیره کد انتخاب شده تا بتوانیم دکمه مربوطه را در ظاهر برنامه (UI) رنگی کنیم
    this.selectedCode = code;

    // 2. منطق فیلترینگ
    if (code === null) {
      // اگر کاربر "همه" را زد (code برابر null بود):
      // محتویات "انبار" را کامل بریز داخل لیست نمایش
      this.filteredUniversities = this.allUniversities;
    } else {
      // اگر یک کشور خاص انتخاب شد:
      // برو داخل لیست اصلی بگرد و فقط دانشگاه‌هایی را جدا کن که country آن‌ها برابر با کد انتخاب شده است
      this.filteredUniversities = this.allUniversities.filter((uni) => uni.country === code);
    }
  }
}
