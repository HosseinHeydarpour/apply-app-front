import { Pipe, PipeTransform } from '@angular/core';

/**
 * @class JalaliPipe
 * @description این یک "Pipe" یا مبدل است. در آنگولار، پایپ‌ها مانند یک فیلتر عمل می‌کنند؛
 * ورودی را می‌گیرند، روی آن تغییراتی انجام می‌دهند و در نهایت خروجی را با شکل و شمایل جدید نمایش می‌دهند.
 * وظیفه این پایپ، تبدیل تاریخ میلادی به تاریخ شمسی (جلالی) است.
 */
@Pipe({
  name: 'jalali', // نامی که در فایل‌های HTML برای استفاده از این مبدل به کار می‌رود
})
export class JalaliPipe implements PipeTransform {
  /**
   * @method transform
   * @description تابع اصلی که عملیات تبدیل تاریخ را انجام می‌دهد.
   * @param value مقداری که قرار است تبدیل شود (معمولاً تاریخ میلادی از سمت سرور)
   * @param includeTime (اختیاری) تعیین می‌کند که آیا ساعت و دقیقه هم در خروجی باشد یا خیر (پیش‌فرض: خیر)
   * @returns {string} تاریخ تبدیل شده به صورت رشته فارسی (مثلاً ۱۴۰۲/۰۵/۲۰)
   */
  transform(value: any, includeTime: boolean = false): string {
    // ۱. اگر مقداری وارد نشده باشد، چیزی برنگردان تا برنامه دچار خطا نشود
    if (!value) return '';

    // ۲. تبدیل مقدار ورودی به یک شیء استاندارد تاریخ در جاوا اسکریپت
    const date = new Date(value);

    // ۳. تعریف تنظیمات برای تبدیل تاریخ به فارسی و تقویم شمسی
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', // نمایش سال به صورت عددی
      month: '2-digit', // نمایش ماه به صورت دو رقمی (مثلاً ۰۵)
      day: '2-digit', // نمایش روز به صورت دو رقمی
      calendar: 'persian', // استفاده از تقویم خورشیدی (Persian)
    };

    // ۴. اگر کاربر خواسته بود ساعت هم نمایش داده شود، تنظیمات ساعت را اضافه کن
    if (includeTime) {
      options.hour = '2-digit'; // نمایش ساعت
      options.minute = '2-digit'; // نمایش دقیقه
    }

    /**
     * ۵. استفاده از ابزار داخلی مرورگر (Intl) برای فرمت‌دهی نهایی.
     * 'fa-IR' یعنی خروجی با زبان فارسی و اعداد فارسی باشد.
     */
    return new Intl.DateTimeFormat('fa-IR', options).format(date);
  }
}
