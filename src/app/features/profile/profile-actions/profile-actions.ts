import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { Auth } from '../../../core/services/auth';

/**
 * کامپوننت دکمه‌های عملیاتی پروفایل (ProfileActions)
 *
 * وظیفه این کامپوننت نمایش دکمه‌هایی است که کاربر با آن‌ها تعامل دارد،
 * به خصوص دکمه "خروج" (Logout). معمولاً این دکمه‌ها پایین کارت پروفایل قرار می‌گیرند.
 */
@Component({
  selector: 'app-profile-actions', // نام تگی که در HTML استفاده می‌شود
  imports: [TuiIcon, RouterLink], // ابزارهای مورد نیاز (آیکون‌ها و لینک‌ها)
  templateUrl: './profile-actions.html', // فایل ظاهر (HTML)
  styleUrl: './profile-actions.scss', // فایل استایل (CSS)
  host: {
    // استایل‌های قاب اصلی کامپوننت.
    // p-2: فاصله داخلی کم، ps-6 و pl-6: فاصله از چپ برای تراز شدن متن‌ها.
    class: 'p-2 ps-6 pl-6  block',
  },
})
export class ProfileActions {
  /**
   * سرویس احراز هویت (Auth Service).
   *
   * @description
   * این سرویس مسئولیت کارهای امنیتی مثل "ورود" (Login) و "خروج" (Logout) را دارد.
   * ما با استفاده از inject، این ابزار را به کامپوننت خودمان وارد کرده‌ایم.
   */
  authService = inject(Auth);

  /**
   * متد خروج از حساب کاربری.
   *
   * @description
   * این تابع زمانی اجرا می‌شود که کاربر روی دکمه "خروج" (در فایل HTML) کلیک کند.
   * این تابع به سرویس Auth می‌گوید: "کاربر می‌خواهد خارج شود، کارهای لازم را انجام بده".
   */
  logout() {
    this.authService.logout();
  }
}
