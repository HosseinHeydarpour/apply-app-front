import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

/**
 * @class HorizontalCard
 * @description این کامپوننت مانند یک "قالب آماده" عمل می‌کند.
 * وظیفه آن نمایش اطلاعات یک آیتم (مثل دانشگاه یا خدمات) به صورت یک کارت افقی زیبا است.
 * این کد به تنهایی اطلاعاتی ندارد، بلکه منتظر می‌ماند تا از بیرون به آن اطلاعات تزریق شود.
 */
@Component({
  selector: 'app-horizontal-card', // نامی که در صفحات دیگر برای فراخوانی این کارت استفاده می‌شود
  imports: [TuiIcon, RouterLink], // ابزارهای لازم برای نمایش آیکون و قابلیت کلیک روی کارت
  templateUrl: './horizontal-card.html',
  styleUrl: './horizontal-card.scss',
})
export class HorizontalCard {
  /**
   * @property name
   * @description ورودی اجباری برای نام یا عنوان کارت (مثلاً نام دانشگاه).
   */
  name = input.required<string>();

  /**
   * @property image
   * @description ورودی اجباری برای آدرس تصویر کارت.
   */
  image = input.required<string>();

  /**
   * @property rating
   * @description ورودی اجباری برای امتیاز (عدد) که معمولاً با ستاره نمایش داده می‌شود.
   */
  rating = input.required<number>();

  /**
   * @property description
   * @description ورودی اجباری برای توضیحات کوتاهی که روی کارت نمایش داده می‌شود.
   */
  description = input.required<string>();

  /**
   * @property destination
   * @description ورودی اجباری برای مسیر (آدرس) که کاربر بعد از کلیک روی کارت به آنجا هدایت می‌شود.
   */
  destination = input.required<string>();

  /**
   * @property id
   * @description شناسه (ID) اختیاری آیتم؛ اگر نیاز باشد کار خاصی با کد آیتم انجام دهیم از این استفاده می‌کنیم.
   */
  id = input<number | string>();
}
