import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UniversityService } from '../services/university-service';

/**
 * این تابع یک Resolver برای دریافت لیست کامل دانشگاه‌ها است.
 * هدف این است که قبل از باز شدن صفحه "جستجو" یا "لیست دانشگاه‌ها"،
 * تمام اطلاعات لازم از سرور دریافت شده باشد تا صفحه خالی به کاربر نمایش داده نشود.
 *
 * @returns {Observable<any>} جریانی از داده‌ها که شامل لیست تمام دانشگاه‌هاست.
 */
export const exploreResolver: ResolveFn<any> = () => {
  // ۱. دسترسی به سرویس دانشگاه‌ها (UniversityService) با استفاده از تابع inject.
  // این خط مثل این است که ابزار لازم برای ارتباط با پایگاه داده را از جعبه‌ابزار آنگولار برداریم.
  const universityService = inject(UniversityService);

  // ۲. درخواست دریافت لیست کامل دانشگاه‌ها و بازگرداندن آن.
  // در اینجا ما متد getAllUniversities را صدا می‌زنیم که به سرور می‌گوید: "همه چیز را بفرست".
  // آنگولار صبر می‌کند تا این لیست آماده شود، سپس صفحه را به کاربر نشان می‌دهد.
  return universityService.getAllUniversities();
};
