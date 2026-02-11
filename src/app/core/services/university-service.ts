import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs';

/**
 * سرویس دانشگاه‌ها (UniversityService)
 * -----------------------------------
 * این کلاس مسئول ارتباط با سرور (Backend) برای گرفتن اطلاعات دانشگاه‌ها
 * و ارسال درخواست پذیرش (Apply) است.
 *
 * تصور کنید این کلاس مثل یک "پیک" است که بین برنامه شما و دیتابیس دانشگاه‌ها رفت و آمد می‌کند.
 *
 * @class UniversityService
 */
@Injectable({
  providedIn: 'root', // یعنی این سرویس در کل برنامه در دسترس است و نیاز نیست در هر صفحه جداگانه ساخته شود.
})
export class UniversityService {
  // تزریق وابستگی (Dependency Injection):
  // ما به ابزار HttpClient نیاز داریم تا بتوانیم به اینترنت وصل شویم و درخواست بفرستیم.
  http = inject(HttpClient);

  // آدرس اصلی سرور را از فایل تنظیمات (environment) می‌خوانیم.
  // مثلا: https://api.mysite.com
  apiURL = environment.apiUrl;

  /**
   * دریافت لیست تمام دانشگاه‌ها
   *
   * این متد به سرور می‌گوید: "لیست همه دانشگاه‌ها را به من بده".
   *
   * @returns {Observable} لیستی از دانشگاه‌ها که از سرور گرفته شده.
   */
  getAllUniversities() {
    // 1. ارسال درخواست GET به آدرس .../api/universities
    return this.http.get(`${this.apiURL}/universities`).pipe(
      // 2. تمیز کردن داده‌ها (Data Transformation):
      // سرور معمولاً داده را در یک پاکت بزرگ می‌فرستد (مثلاً شامل وضعیت موفقیت و پیام‌ها).
      // ما با map فقط محتویات اصلی (universities) را برمی‌داریم و بقیه پاکت را دور می‌ریزیم.
      map((res: any) => {
        return res.data.universities;
      }),
    );
  }

  /**
   * دریافت لیست دانشگاه‌های برتر (Top Universities)
   *
   * @returns {Observable} لیستی از دانشگاه‌های تاپ و برتر.
   */
  getTopUnis() {
    // ارسال درخواست به آدرس خاصی که فقط دانشگاه‌های برتر را برمی‌گرداند.
    return this.http.get(`${this.apiURL}/universities/top`).pipe(
      map((res: any) => {
        // استخراج بخش universities از پاسخ سرور
        return res.data.universities;
      }),
    );
  }

  /**
   * دریافت جزئیات یک دانشگاه خاص
   *
   * @param {number | string} id - شناسه (ID) دانشگاه مورد نظر.
   * @returns {Observable} اطلاعات کامل آن دانشگاه (مثل نام، شهر، رتبه و...).
   */
  getUniversity(id: number | string) {
    // اینجا ID دانشگاه به انتهای آدرس می‌چسبد.
    // مثلاً اگر ID برابر 5 باشد، درخواست به .../api/universities/5 ارسال می‌شود.
    return this.http.get(`${this.apiURL}/universities/${id}`).pipe(
      map((res: any) => {
        // اینجا چون فقط اطلاعات "یک" دانشگاه را می‌خواهیم، کلید university را برمی‌گردانیم.
        return res.data.university;
      }),
    );
  }

  /**
   * ارسال درخواست پذیرش (Apply) برای یک دانشگاه
   *
   * این متد اطلاعات کاربر را برای ثبت نام در دانشگاه به سرور می‌فرستد.
   *
   * @param {number | string} universityId - شناسه دانشگاهی که کاربر می‌خواهد اپلای کند.
   * @returns {Observable} نتیجه درخواست (موفقیت یا شکست).
   */
  requestAdmission(universityId: number | string) {
    // نکته مهم: اینجا از متد POST استفاده می‌کنیم چون می‌خواهیم چیزی را در دیتابیس "ثبت" یا "ایجاد" کنیم.

    // بدنه درخواست (Body): { universityId }
    // این یعنی ما یک بسته اطلاعاتی درست می‌کنیم که داخلش ID دانشگاه هست و به سرور می‌دهیم.
    return this.http.post(`${this.apiURL}/users/apply`, { universityId }).pipe(
      map((res: any) => {
        // بازگرداندن نتیجه نهایی به کامپوننت (مثلاً پیام "درخواست شما ثبت شد")
        return res.data;
      }),
    );
  }
}
