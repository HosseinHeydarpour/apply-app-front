import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '../services/user-service';

/**
 * این تابع (Resolver) وظیفه دارد اطلاعات کاربر جاری را قبل از ورود به صفحه مورد نظر دریافت کند.
 * این کار باعث می‌شود به محض باز شدن صفحه، نام و مشخصات کاربر آماده نمایش باشد.
 * * @param {ActivatedRouteSnapshot} route - اطلاعات مسیر (در اینجا مستقیماً استفاده نشده است).
 * @param {RouterStateSnapshot} state - وضعیت لحظه‌ای مسیریابی.
 * @returns {Observable<any>} جریانی از داده‌ها که حاوی اطلاعات کاربر لاگین شده است.
 */
export const userResolver: ResolveFn<any> = (route, state) => {
  // ۱. تزریق سرویس کاربر (UserService).
  // ما از تابع inject استفاده می‌کنیم تا به متدهای مدیریت کاربران دسترسی پیدا کنیم.
  const userService = inject(UserService);

  // ۲. فراخوانی متد دریافت اطلاعات کاربر.
  // این خط به سرور درخواست می‌فرستد: "اطلاعات شخصی که هم‌اکنون وارد سیستم شده را بده".
  //
  // خروجی یک Observable است؛ روتر آنگولار به صورت خودکار منتظر می‌ماند تا پاسخ از سرور برسد،
  // سپس اجازه می‌دهد صفحه (Component) بارگذاری و نمایش داده شود.
  return userService.getUser();
};
