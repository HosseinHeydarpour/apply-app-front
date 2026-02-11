import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user-service';
import { Observable } from 'rxjs';

/**
 * این تابع Resolver وظیفه دارد تاریخچه فعالیت‌های کاربر را قبل از باز شدن صفحه بارگذاری کند.
 * استفاده از نوع <any[]> نشان می‌دهد که ما انتظار داریم سرور یک "لیست" (آرایه) به ما برگرداند.
 *
 * @param {ActivatedRouteSnapshot} route - اطلاعات مربوط به مسیر فعلی (در این کد استفاده مستقیم نشده اما جزو ساختار استاندارد است).
 * @param {RouterStateSnapshot} state - وضعیت لحظه‌ای روتر (این هم جزو امضای استاندارد تابع است).
 * @returns {Observable<any[]>} جریان داده‌ای که شامل "لیست" تاریخچه کاربر است.
 */
// Ensure the return type matches what your service returns (e.g., Observable<any[]>)
export const historyResolver: ResolveFn<any[]> = (route, state) => {
  // ۱. تزریق سرویس کاربر (UserService) برای دسترسی به توابع آن.
  // ما ابزار لازم برای صحبت با بخش اطلاعات کاربر را در اینجا آماده می‌کنیم.
  const userService = inject(UserService);

  // ۲. نکته بسیار مهم (CRITICAL): بازگرداندن نتیجه تابع.
  // ما حتماً باید کلمه 'return' را بنویسیم.
  // اگر این کار را نکنیم، انگار غذا را سفارش داده‌ایم اما فیش را به گارسون نداده‌ایم؛
  // آنگولار (Router) متوجه نمی‌شود که باید منتظر بماند و بلافاصله صفحه خالی را باز می‌کند.
  // این خط به روتر می‌گوید: "مشترک شو (Subscribe)، صبر کن تا لیست بیاید، سپس صفحه را نشان بده".
  return userService.getUserHistory();
};
