import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AgencyService } from '../services/agency-service';
import { Observable } from 'rxjs';

/**
 * تابعی برای بارگذاری اولیه اطلاعات آژانس قبل از نمایش صفحه.
 * این تابع نقش یک واسط (Resolver) را بازی می‌کند که قبل از فعال شدن مسیر (Route)،
 * داده‌های مورد نیاز را از سرور دریافت می‌کند.
 *
 * @param {ActivatedRouteSnapshot} route - تصویر لحظه‌ای از مسیر فعال؛ شامل اطلاعاتی مثل پارامترهای URL (مثلاً شناسه یا id).
 * @param {RouterStateSnapshot} state - وضعیت کلی روتر در لحظه درخواست.
 * @returns {Observable<any>} جریان داده‌ای (Observable) که شامل اطلاعات آژانس است و به کامپوننت تحویل داده می‌شود.
 */
export const agencyResolver: ResolveFn<any> = (route, state) => {
  // ۱. دریافت پارامتر 'id' از آدرس صفحه (URL).
  // مثال: اگر آدرس /agency/123 باشد، مقدار 123 را استخراج می‌کند.
  // paramMap یک نقشه از تمام پارامترهای موجود در آدرس است.
  const id = route.paramMap.get('id'); // get 'id' from route

  // ۲. استفاده از مکانیزم "تزریق وابستگی" (Dependency Injection) به صورت تابعی.
  // در اینجا سرویس AgencyService را صدا می‌زنیم تا بتوانیم از متدهای آن (مثل دریافت اطلاعات از سرور) استفاده کنیم.
  const agencyService = inject(AgencyService); // inject your service

  // ۳. اعتبارسنجی (Validation): بررسی می‌کنیم که آیا شناسه (id) وجود دارد یا خیر.
  // اگر آیدی در URL نباشد، ادامه کار بی‌فایده است و خطا برمی‌گردانیم.
  if (!id) {
    throw new Error('No ID provided in route!');
  }

  // ۴. فراخوانی متد سرویس و بازگرداندن نتیجه.
  // در اینجا درخواست به سرور ارسال می‌شود و نتیجه به صورت یک Observable (جریان داده ناهمگام)
  // به سیستم مسیریابی آنگولار تحویل داده می‌شود تا صفحه منتظر دریافت داده بماند.
  return agencyService.getAgency(id);
};
