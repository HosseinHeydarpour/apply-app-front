import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';

/**
 * سرویس مدیریت آژانس‌ها (AgencyService)
 * -------------------------------------
 * این کلاس مسئول برقراری ارتباط با سرور (Backend) برای دریافت و ارسال اطلاعات
 * مربوط به آژانس‌ها و مشاوره‌ها است.
 *
 * @class AgencyService
 */
@Injectable({
  providedIn: 'root', // یعنی این سرویس در کل برنامه در دسترس است و نیاز نیست جایی دیگر تعریف شود.
})
export class AgencyService {
  // استفاده از inject برای دسترسی به HttpClient (ابزار ارسال درخواست‌های اینترنتی)
  // این روش جدیدتر و تمیزتر از نوشتن constructor در انگولار است.
  httpClient = inject(HttpClient);

  /**
   * دریافت لیست تمام آژانس‌ها
   *
   * این متد یک درخواست GET به سرور می‌فرستد تا لیست آژانس‌ها را بگیرد.
   *
   * @returns {Observable<any>} جریانی از داده‌ها که شامل لیست آژانس‌هاست.
   */
  getAgencies() {
    // ارسال درخواست به آدرس: .../api/agencies
    return this.httpClient.get(`${environment.apiUrl}/agencies`).pipe(
      // استفاده از map برای تمیز کردن داده دریافتی:
      // سرور یک پاسخ کلی می‌دهد (res)، ما فقط بخش data.agencies را بیرون می‌کشیم
      // تا کامپوننت مستقیماً با لیست آژانس‌ها کار کند، نه کل پاسخ سرور.
      map((res: any) => {
        return res.data.agencies;
      }),
    );
  }

  /**
   * دریافت اطلاعات یک آژانس خاص
   *
   * @param {string | number} id - شناسه (ID) آژانس مورد نظر
   * @returns {Observable<any>} جریانی از داده که شامل اطلاعات کامل آن آژانس است.
   */
  getAgency(id: string | number) {
    // ارسال درخواست GET به همراه ID در انتهای آدرس. مثال: .../api/agencies/123
    return this.httpClient.get(`${environment.apiUrl}/agencies/${id}`).pipe(
      // استخراج آبجکت 'agency' از درون پاسخ سرور
      map((res: any) => {
        return res.data.agency;
      }),
    );
  }

  /**
   * ثبت درخواست مشاوره برای یک آژانس
   *
   * این متد اطلاعات لازم را به صورت یک درخواست POST به سرور می‌فرستد.
   *
   * @param {string} agencyId - شناسه آژانسی که کاربر می‌خواهد با آن مشاوره کند.
   * @param {Date | string} [scheduledAt] - (اختیاری) تاریخ رزرو مشاوره.
   * @returns {Observable<any>} نتیجه ثبت درخواست که از سرور برمی‌گردد.
   */
  requestConsultation(agencyId: string, scheduledAt?: Date | string): Observable<any> {
    // 1. ساختن بدنه درخواست (Body):
    // اطلاعاتی که باید به سرور بفرستیم را در یک آبجکت JSON قرار می‌دهیم.
    const body = {
      agencyId: agencyId,
      // نکته: متغیر scheduledAt اینجا استفاده نشده اما اگر در آینده نیاز باشد،
      // می‌توان آن را به این آبجکت اضافه کرد: scheduledAt: scheduledAt
    };

    // 2. ارسال درخواست POST به اندپوینت مربوطه (/users/consultation):
    // متد POST برای ثبت اطلاعات جدید در دیتابیس استفاده می‌شود.
    return this.httpClient.post(`${environment.apiUrl}/users/consultation`, body).pipe(
      map((res: any) => {
        // 3. بازگرداندن پاسخ نهایی:
        // معمولاً سرور تاییدیه یا دیتای ساخته شده را برمی‌گرداند.
        // ما کل بخش data را به کامپوننت پاس می‌دهیم.
        return res.data;
      }),
    );
  }

  /**
   * دریافت لیست آژانس‌های تبلیغاتی (ویژه)
   *
   * این متد آژانس‌هایی که در بخش تبلیغات (ads) قرار دارند را فراخوانی می‌کند.
   *
   * @returns {Observable<any>} لیست آژانس‌های تبلیغاتی.
   */
  getAdvertisedAgencies() {
    // ارسال درخواست GET به آدرس تبلیغات
    return this.httpClient.get(`${environment.apiUrl}/ads`).pipe(
      // استخراج لیست تبلیغات (ads) از پاسخ سرور
      map((res: any) => {
        return res.data.ads;
      }),
    );
  }
}
