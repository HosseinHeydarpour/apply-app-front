import { Component, inject, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user-service';
import { environment } from '../../../../environments/environment.development';

/**
 * کامپوننت کارت پروفایل (ProfileCard)
 *
 * وظیفه این کامپوننت نمایش اطلاعات خلاصه کاربر در قالب یک کارت است.
 * این کامپوننت اطلاعات کاربر را از بیرون (پدر) دریافت کرده و نمایش می‌دهد.
 */
@Component({
  selector: 'app-profile-card', // نام تگی که در HTML استفاده می‌شود: <app-profile-card></app-profile-card>
  imports: [TuiIcon, RouterLink, CommonModule], // ماژول‌های مورد نیاز که در این کامپوننت استفاده شده‌اند
  templateUrl: './profile-card.html', // آدرس فایل HTML (ظاهر کامپوننت)
  styleUrl: './profile-card.scss', // آدرس فایل استایل‌ها (CSS/SCSS)
  host: {
    // این کلاس‌ها مستقیماً به تگِ خودِ کامپوننت (<app-profile-card>) اعمال می‌شوند.
    // کلاس‌های p-8 و... مربوط به Tailwind هستند که فاصله داخلی (Padding) می‌دهند.
    class: 'p-8 ps-6 pl-6  block',
  },
})
export class ProfileCard {
  /**
   * سرویس مدیریت کاربران (UserService).
   *
   * @description
   * با استفاده از inject (تزریق وابستگی مدرن در انگولار)، به متدها و منطق‌های مربوط به کاربر دسترسی داریم.
   * اگر استاد پرسید: "چرا constructor نداریم؟"، بگویید: "از تابع inject استفاده کردم که روش جدیدتر و تمیزتر انگولار است."
   */
  protected userService = inject(UserService);

  /**
   * ورودی اطلاعات کاربر (Input Signal).
   *
   * @description
   * این متغیر منتظر می‌ماند تا کامپوننت پدر، اطلاعات کاربر (مثل نام، عکس و...) را به آن بدهد.
   * نوع آن `input` است، یعنی یک Signal (سیگنال) که روش جدید انگولار برای مدیریت تغییرات داده است.
   * @type {InputSignal<any>}
   */
  user = input<any>();

  /**
   * آدرس پایه سرور (Base URL).
   *
   * @description
   * آدرس اصلی بک‌ند (مثلاً https://api.mysite.com) را از فایل تنظیمات محیطی (environment) می‌خواند.
   * این کار باعث می‌شود اگر آدرس سرور عوض شد، فقط فایل environment را تغییر دهیم نه کل کد را.
   */
  baseURL = environment.baseUrl;

  /**
   * متد ساخت آدرس کامل تصویر.
   *
   * @description
   * چون در دیتابیس معمولاً فقط نام فایل (مثلاً 'avatar.jpg') ذخیره می‌شود،
   * این تابع نام فایل را می‌گیرد و آن را به آدرس سرور می‌چسباند تا عکس قابل نمایش شود.
   *
   * @param {string} imageName - نام فایل تصویر (مثلاً 'user123.png')
   * @returns {string} - آدرس کامل اینترنتی تصویر برای قرار دادن در src عکس.
   */
  createImagePath(imageName: string) {
    // از Template Literal (استفاده از بک‌تیک ` و $) برای چسباندن رشته‌ها استفاده شده است.
    return `${this.baseURL}/images/${imageName}`;
  }
}
