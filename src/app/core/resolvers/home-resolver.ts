import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AgencyService } from '../services/agency-service';
import { UniversityService } from '../services/university-service';

/**
 * این تابع Resolver برای صفحه اصلی (Home) است.
 * وظیفه آن بارگذاری همزمان چندین دسته از اطلاعات (دانشگاه‌ها، آژانس‌ها و تبلیغات) است.
 * استفاده از این روش باعث می‌شود صفحه فقط زمانی نمایش داده شود که تمام این اطلاعات آماده باشند.
 *
 * @param {ActivatedRouteSnapshot} route - اطلاعات مسیر فعال.
 * @param {RouterStateSnapshot} state - وضعیت روتر.
 * @returns {Observable<{ universities: any; agencies: any; ads: any }>} یک جریان داده شامل یک شیء که تمام نتایج را در خود دارد.
 */
export const homeResolver: ResolveFn<{ universities: any; agencies: any }> = (route, state) => {
  // ۱. تزریق سرویس‌های مورد نیاز (دانشگاه و آژانس).
  // ما به هر دو سرویس نیاز داریم چون صفحه اصلی ترکیبی از اطلاعات مختلف است.
  const universityService = inject(UniversityService);
  const agencyService = inject(AgencyService);

  // ۲. استفاده از تکنیک "اجرای موازی" با forkJoin.
  // این دستور بسیار مهم است. به جای اینکه درخواست‌ها را یکی‌یکی بفرستیم،
  // همه را با هم می‌فرستیم و منتظر می‌مانیم تا آخرین درخواست هم تمام شود.
  //
  return forkJoin({
    // الف) دریافت دانشگاه‌های برتر
    universities: universityService.getTopUnis(),
    // ب) دریافت لیست آژانس‌ها
    agencies: agencyService.getAgencies(),
    // ج) دریافت آژانس‌های تبلیغاتی (ویژه)
    ads: agencyService.getAdvertisedAgencies(),
  });
};
