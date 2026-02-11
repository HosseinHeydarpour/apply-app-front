import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UniversityService } from '../services/university-service';

/**
 * این تابع به عنوان یک Resolver عمل می‌کند تا اطلاعات دقیق یک دانشگاه را
 * پیش از لود شدن صفحه جزئیات (Details Page) از سرور دریافت کند.
 *
 * @param {ActivatedRouteSnapshot} route - حاوی اطلاعات مسیر، از جمله پارامترهای آدرس (مثل id).
 * @param {RouterStateSnapshot} state - وضعیت فعلی روتر را در خود نگه می‌دارد.
 * @returns {Observable<any>} داده‌های مربوط به دانشگاه مورد نظر را به صورت یک آبجکت برمی‌گرداند.
 */
export const universityResolver: ResolveFn<any> = (route, state) => {
  // ۱. تزریق سرویس دانشگاه (UniversityService) برای برقراری ارتباط با API.
  // از تابع inject برای دسترسی به متدهای سرویس در خارج از کلاس استفاده شده است.
  const universityService = inject(UniversityService);

  // ۲. استخراج پارامتر 'id' از پارامترهای مسیر.
  // در اینجا از route.params استفاده شده که مستقیماً به متغیرهای تعریف شده در مسیر دسترسی دارد.
  const id = route.params['id'];

  // ۳. کنترل خطا (Error Handling): اگر به هر دلیلی شناسه در آدرس وجود نداشته باشد،
  // برنامه یک خطا پرتاب می‌کند تا از ارسال درخواست ناقص به سرور جلوگیری شود.
  if (!id) {
    throw new Error('No ID provided in route!');
  }

  // ۴. فراخوانی متد مربوطه در سرویس و بازگشت دادن خروجی.
  // متد getUniversity(id) یک درخواست GET به سرور می‌زند تا اطلاعات آن دانشگاه خاص را دریافت کند.
  // سیستم روتر آنگولار (Angular Router) منتظر می‌ماند تا پاسخ سرور برسد.
  return universityService.getUniversity(id);
};
