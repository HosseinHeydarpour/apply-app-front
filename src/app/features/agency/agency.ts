import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TuiButton, TuiAlertService } from '@taiga-ui/core'; // 1. Import TuiAlertService
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { AgencyService } from '../../core/services/agency-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Auth } from '../../core/services/auth';

/**
 * @description
 * کامپوننت نمایش جزئیات آژانس (Agency).
 * این کلاس مسئول مدیریت صفحه نمایش اطلاعات یک آژانس خاص است.
 *
 * وظایف اصلی:
 * 1. دریافت اطلاعات آژانس از طریق Route (آدرس صفحه).
 * 2. نمایش تصاویر در اسلایدر (Carousel).
 * 3. ارسال درخواست مشاوره به سمت سرور.
 */
@Component({
  selector: 'app-agency',
  standalone: true,
  imports: [NgFor, TuiButton, TuiCarousel, TuiPagination, RouterLink],
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
})
export class Agency implements OnInit {
  /**
   * این متغیر شماره اسلاید فعلی در نمایش تصاویر (Carousel) را نگه می‌دارد.
   * عدد 0 یعنی نمایش از اولین عکس شروع شود.
   */
  protected index = 0;

  /**
   * دسترسی به اطلاعات آدرس (URL) فعلی.
   * با این ابزار می‌توانیم بفهمیم روی چه آدرسی هستیم و چه داده‌هایی با آن ارسال شده است.
   */
  protected route = inject(ActivatedRoute);

  /**
   * سرویس اختصاصی آژانس‌ها.
   * تمام ارتباطات با سرور (مثل ارسال درخواست مشاوره) از طریق این سرویس انجام می‌شود.
   */
  protected agencyService = inject(AgencyService);

  /**
   * سرویس نمایش پیام‌های هشدار (Alert/Toast).
   * برای نمایش پیام‌های "موفقیت" یا "خطا" در گوشه صفحه استفاده می‌شود.
   * private readonly: یعنی فقط در همین فایل قابل استفاده است و غیرقابل تغییر است.
   */
  private readonly alerts = inject(TuiAlertService);

  // متغیری برای ذخیره اطلاعات کامل آژانس که از سرور یا روت گرفته می‌شود
  agency: any;

  // آدرس پایه سرور (Backend) برای ساخت لینک تصاویر
  baseURL = environment.baseUrl;

  // سرویس احراز هویت (برای چک کردن لاگین بودن کاربر - در صورت نیاز)
  authService = inject(Auth);

  // آدرس API برای سایر درخواست‌ها
  apiUrl = environment.apiUrl;

  /**
   * @function ngOnInit
   * @description
   * این متد بلافاصله پس از لود شدن کامپوننت اجرا می‌شود.
   * بهترین مکان برای مقداردهی اولیه متغیرهاست.
   */
  ngOnInit(): void {
    // اطلاعات آژانس را از داده‌های پیش‌بارگذاری شده (Resolver) در روت می‌خوانیم.
    // snapshot.data: یعنی به داده‌هایی که همین الان در آدرس موجود است دسترسی پیدا کن.
    this.agency = this.route.snapshot.data['agency'];
  }

  /**
   * @function createImagePath
   * @description
   * یک نام تصویر را می‌گیرد و آدرس کامل اینترنتی آن را می‌سازد.
   *
   * @param {string} imageName - نام فایل تصویر (مثلاً 'logo.png')
   * @returns {string} آدرس کامل تصویر برای نمایش در تگ img
   */
  createImagePath(imageName: string) {
    // چسباندن آدرس پایه سایت به نام پوشه تصاویر و نام فایل
    return `${this.baseURL}/images/${imageName}`;
  }

  /**
   * @function requestConsultation
   * @description
   * این متد وقتی کاربر دکمه "درخواست مشاوره" را کلیک می‌کند فراخوانی می‌شود.
   * یک درخواست به سرور می‌فرستد و نتیجه (موفقیت یا خطا) را مدیریت می‌کند.
   */
  requestConsultation() {
    // فراخوانی متد درخواست مشاوره از سرویس و ارسال شناسه (_id) آژانس فعلی
    this.agencyService.requestConsultation(this.agency._id).subscribe({
      // بخش next: وقتی سرور پاسخ مثبت داد (همه چیز درست بود) اجرا می‌شود
      next: (res) => {
        // 3. Show Success Toast
        // ایجاد یک پیام موفقیت (سبز رنگ)
        this.alerts
          .open('درخواست مشاوره با موفقیت ارسال شد.', {
            label: 'موفقیت', // عنوان پیام
            appearance: 'positive', // ظاهر مثبت (معمولاً سبز)
            autoClose: 3000, // بعد از 3 ثانیه خودکار بسته شود
          })
          .subscribe(); // <--- نکته مهم: در کتابخانه Taiga UI حتما باید subscribe صدا زده شود تا پیام نمایش داده شود.

        // ایجاد وقفه 3 ثانیه‌ای و سپس بازگشت به صفحه قبل
        setTimeout(() => {
          // شبیه سازی دکمه Back مرورگر (کاربر را به صفحه‌ای که از آن آمده بود برمی‌گرداند)
          window.history.back();
        }, 3000);
      },
      // بخش error: وقتی سرور خطا داد یا ارتباط قطع بود اجرا می‌شود
      error: (error) => {
        // 4. Show Error Toast
        // ایجاد یک پیام خطا (قرمز رنگ)
        this.alerts
          .open('درخواست مشاوره با موفقیت ارسال شد.', {
            // (نکته: متن پیام در کد اصلی شما ثابت مانده بود، اما ظاهرش خطاست)
            label: 'خطا', // عنوان پیام
            appearance: 'negative', // ظاهر منفی (معمولاً قرمز)
            autoClose: 3000,
          })
          .subscribe(); // <--- فعال‌سازی نمایش پیام

        // چاپ جزئیات خطا در کنسول مرورگر برای عیب‌یابی برنامه‌نویس
        console.error(error);
      },
    });
  }
}
