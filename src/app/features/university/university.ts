import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiAlertService, TuiButton } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { environment } from '../../../environments/environment.development';
import { Auth } from '../../core/services/auth';
import { UniversityService } from '../../core/services/university-service';

/**
 * @class University
 * @description این کامپوننت وظیفه نمایش جزئیات کامل یک دانشگاه خاص را بر عهده دارد.
 * همچنین امکاناتی مثل مشاهده گالری تصاویر دانشگاه و ارسال درخواست مشاوره/پذیرش را فراهم می‌کند.
 */
@Component({
  selector: 'app-university',
  imports: [NgFor, TuiButton, TuiCarousel, TuiPagination, RouterLink],
  templateUrl: './university.html',
  styleUrl: './university.scss',
})
export class University implements OnInit {
  // متغیری برای کنترل شماره تصویر در حال نمایش در اسلایدر (Carousel)
  protected index = 0;

  // ابزارهای مورد نیاز برای گرفتن داده‌ها، ارتباط با سرور و نمایش پیام
  route = inject(ActivatedRoute);
  university: any; // متغیر ذخیره اطلاعات دانشگاه
  baseURL = environment.baseUrl; // آدرس پایه سرور برای بارگذاری عکس‌ها
  authService = inject(Auth);
  universityService = inject(UniversityService);

  /**
   * @description سرویس نمایش پیام‌های هشدار (Alert) به صورت پاپ‌آپ.
   * از کلمه readonly استفاده شده چون قرار نیست مقدار این سرویس در طول برنامه تغییر کند.
   */
  private readonly alerts = inject(TuiAlertService);

  /**
   * @method ngOnInit
   * @description به محض باز شدن صفحه، اطلاعات دانشگاه را از ورودی‌های آدرس (Snapshot) می‌گیرد.
   */
  ngOnInit(): void {
    // داده‌ها قبلاً توسط Resolver آماده شده و ما اینجا فقط آن‌ها را برمی‌داریم.
    this.university = this.route.snapshot.data['university'];
    console.log(this.university); // برای بررسی ساختار داده در کنسول مرورگر
  }

  /**
   * @method createImagePath
   * @description ترکیب آدرس اصلی سرور با نام فایل عکس برای ساخت آدرس کامل تصویر.
   * @param imageName نام فایل تصویر (مثلاً 'university.jpg')
   * @returns {string} آدرس کامل و قابل نمایش در مرورگر
   */
  createImagePath(imageName: string) {
    return `${this.baseURL}/images/${imageName}`;
  }

  /**
   * @method requestAdmission
   * @description ارسال درخواست مشاوره یا پذیرش برای دانشگاه فعلی به سمت سرور.
   */
  requestAdmission() {
    // فراخوانی متد ارسال درخواست در سرویس دانشگاه با استفاده از شناسه (ID) دانشگاه
    this.universityService.requestAdmission(this.university._id).subscribe({
      next: (res: any) => {
        // اگر ارسال موفقیت‌آمیز بود:
        console.log(res);
        // نمایش یک پیام سبز رنگ (Positive) به کاربر
        this.alerts
          .open('درخواست مشاوره با موفقیت ارسال شد.', {
            label: 'موفقیت',
            appearance: 'positive',
            autoClose: 3000, // پیام بعد از ۳ ثانیه خودبه‌خود بسته می‌شود
          })
          .subscribe();

        // صبر کردن به مدت ۳ ثانیه و سپس بازگشت خودکار به صفحه قبلی
        setTimeout(() => {
          window.history.back();
        }, 3000);
      },
      error: (err: any) => {
        // اگر در حین ارسال خطایی رخ داد:
        console.log(err);
        // نمایش یک پیام قرمز رنگ (Negative) به کاربر
        this.alerts
          .open('خطایی در ارسال درخواست رخ داد.', {
            label: 'خطا',
            appearance: 'negative',
            autoClose: 3000,
          })
          .subscribe();
      },
    });
  }
}
