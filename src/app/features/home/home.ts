import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TuiCarousel } from '@taiga-ui/kit';
import { VerticalCard } from '../../shared/components/vertical-card/vertical-card';
import { HorizontalCard } from '../../shared/components/horizontal-card/horizontal-card';
import { UniversityService } from '../../core/services/university-service';
import { environment } from '../../../environments/environment.development';
import { AgencyService } from '../../core/services/agency-service';
import { ActivatedRoute } from '@angular/router';

/**
 * کامپوننت Home (صفحه اصلی)
 *
 * این کامپوننت وظیفه نمایش صفحه اول سایت را دارد که شامل سه بخش اصلی است:
 * 1. لیست دانشگاه‌ها
 * 2. لیست موسسات (Agencies)
 * 3. تبلیغات (Ads)
 */
@Component({
  selector: 'app-home',
  imports: [TuiCarousel, NgFor, VerticalCard, HorizontalCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  /**
   * شماره اسلاید فعلی در کاروسل (اسلایدر).
   * عدد 0 یعنی اسلایدر از اولین عکس شروع می‌شود.
   */
  protected index = 0;

  // تزریق سرویس‌های مورد نیاز (ابزارهایی برای ارتباط با سرور یا منطق برنامه)
  // نکته: در این صفحه دیتا از طریق route می‌آید اما وجود این سرویس‌ها ممکن است برای کارهای جانبی باشد.
  protected universityService = inject(UniversityService);
  protected agencyService = inject(AgencyService);

  /**
   * لیست دانشگاه‌ها برای نمایش در صفحه.
   * این آرایه (Array) در ابتدای کار خالی است و در ngOnInit پر می‌شود.
   */
  universities: any[] = [];

  /**
   * لیست موسسات مهاجرتی برای نمایش.
   */
  agencies: any[] = [];

  /**
   * لیست بنرهای تبلیغاتی.
   */
  ads: any[] = [];

  // آدرس پایه سرور (Backend) که از فایل تنظیمات پروژه خوانده می‌شود.
  baseURL = environment.baseUrl;

  // مسیر کلی تصاویر در سرور. برای اینکه نخواهیم هی تکرار کنیم http://.../images/
  imagePath = `${this.baseURL}/images/`;

  /**
   * ابزار ActivatedRoute برای دسترسی به اطلاعات مسیر فعلی.
   * ما از این ابزار استفاده می‌کنیم تا داده‌هایی که قبل از باز شدن صفحه دانلود شده‌اند (Resolver) را بگیریم.
   */
  route = inject(ActivatedRoute);

  // 1. Track banner image loading
  isBannerLoaded = signal(false);

  // 2. Track your API data loading (set this to false after your API calls finish)
  isLoadingData = signal(true);

  // Dummy array to loop through and create exactly 3 skeleton placeholders
  skeletonArray = [1, 2, 3];

  onBannerLoad() {
    this.isBannerLoaded.set(true);
  }

  /**
   * متد ngOnInit: "لحظه شروع به کار" کامپوننت.
   * این تابع به محض اینکه کاربر وارد صفحه Home شود، اجرا می‌گردد.
   */
  ngOnInit(): void {
    // 1. دریافت کل اطلاعات صفحه از طریق Snapshot (عکس فوری از وضعیت فعلی روت)
    // نام 'homeData' باید دقیقاً همان نامی باشد که در فایل app.routes.ts تعریف شده است.
    const data = this.route.snapshot.data['homeData'];

    // 2. تفکیک اطلاعات و ریختن آن‌ها در ظرف‌های مخصوص (متغیرها)
    // داده‌های دریافتی شامل هر سه بخش (دانشگاه، موسسه، تبلیغ) است.
    this.universities = data.universities;
    this.agencies = data.agencies;
    this.ads = data.ads;

    // 3. چاپ کردن در کنسول مرورگر (برای تست و اطمینان از اینکه دیتا درست آمده)
    console.log(this.universities, this.agencies, this.ads);
  }

  /**
   * یک تابع کمکی برای ساختن لینک کامل عکس.
   *
   * @param uniName - نام فایل عکس (مثلاً 'logo.jpg')
   * @returns آدرس کامل اینترنتی عکس (مثلاً 'https://api.site.com/images/logo.jpg')
   */
  createImagePath(uniName: string) {
    // چسباندن مسیر پایه به نام فایل عکس
    return `${this.imagePath}${uniName}`;
  }
}
