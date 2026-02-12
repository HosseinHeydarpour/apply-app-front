import { Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

/**
 * @class VerticalCard
 * @description این کامپوننت یک "کارت نمایش عمودی" است.
 * از این قطعه برای نمایش خلاصه اطلاعات (مثل عکس در بالا و متن در پایین) استفاده می‌شود.
 * طراحی عمودی معمولاً برای نمایش در لیست‌های شبکه‌ای (Grid) یا کنار هم چیدن چندین کارت استفاده می‌گردد.
 */
@Component({
  selector: 'app-vertical-card', // برچسبی که برای استفاده از این کارت در فایل‌های دیگر به کار می‌رود
  imports: [TuiIcon, RouterLink], // وارد کردن ابزارهای آیکون و مسیریابی
  templateUrl: './vertical-card.html',
  styleUrl: './vertical-card.scss',
})
export class VerticalCard {
  /**
   * @property name
   * @description عنوان اصلی کارت که در بخش متنی نمایش داده می‌شود.
   */
  name = input<string>();

  /**
   * @property image
   * @description آدرس یا مسیر تصویری که در بالای کارت قرار می‌گیرد.
   */
  image = input<string>();

  /**
   * @property rating
   * @description عددی که نشان‌دهنده امتیاز این آیتم است.
   */
  rating = input<number>();

  /**
   * @property description
   * @description توضیح کوتاهی که جزئیات بیشتری درباره این کارت به کاربر می‌دهد.
   */
  description = input<string>();

  /**
   * @property destination
   * @description آدرس داخلی سایت که کاربر پس از کلیک به آنجا منتقل می‌شود.
   */
  destination = input<string>();

  /**
   * @property id
   * @description کد شناسایی منحصر‌به‌فرد این آیتم.
   */
  id = input<number | string>();

  /**
   * @property targetUrl
   * @description یک آدرس مکمل؛ ممکن است برای لینک‌های ثانویه یا دکمه‌های خاص استفاده شود.
   */
  targetUrl = input<string>();
}
