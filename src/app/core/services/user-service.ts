import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, of } from 'rxjs';

/**
 * سرویس کاربر (UserService)
 * -------------------------
 * این کلاس مسئول مدیریت اطلاعات شخصی کاربر است. کارهایی مثل:
 * 1. گرفتن پروفایل کاربر
 * 2. تغییر رمز عبور
 * 3. گرفتن تاریخچه فعالیت‌ها (درخواست‌های پذیرش و مشاوره‌ها)
 *
 * @class UserService
 */
@Injectable({
  providedIn: 'root', // این سرویس در کل برنامه قابل دسترسی است.
})
export class UserService {
  // ابزار ارتباط با سرور (اینترنت)
  http = inject(HttpClient);
  // آدرس پایه سرور (Backend API)
  apiURL = environment.apiUrl;

  /**
   * دریافت اطلاعات پروفایل کاربر فعلی
   *
   * این متد یک کار جالب انجام می‌دهد:
   * چون سرور برای دادن اطلاعات کاربر نیاز به ID دارد، ما ID را از داخل "توکن" ذخیره شده
   * در مرورگر استخراج می‌کنیم و سپس به سرور درخواست می‌فرستیم.
   *
   * @returns {Observable<any>} اطلاعات کاربر (یا null اگر توکن نباشد).
   */
  getUser(): Observable<any> {
    // 1. گرفتن توکن از حافظه مرورگر
    const token = localStorage.getItem('token');

    // اگر توکنی نبود، یعنی کاربر لاگین نیست. پس یک بسته خالی (null) برمی‌گردانیم.
    if (!token) {
      console.error('No JWT token found in localStorage.');
      return of(null); // of(null) یعنی یک Observable که مقدارش پوچ است.
    }

    try {
      // 2. استخراج ID کاربر از داخل توکن (Decoding JWT):
      // توکن سه بخش دارد که با نقطه (.) جدا شده‌اند. بخش دوم (Payload) حاوی اطلاعات است.
      const payload = token.split('.')[1];

      // این بخش رمزنگاری شده را باز می‌کنیم (atob) و به آبجکت تبدیل می‌کنیم (JSON.parse).
      const decoded = JSON.parse(atob(payload));

      // حالا ID کاربر را از داخل آن برمی‌داریم.
      const userId = decoded.id;

      if (!userId) {
        console.error('User ID not found in token payload.');
        return of(null);
      }

      // 3. ارسال درخواست به سرور با استفاده از ID پیدا شده:
      return this.http.get(`${this.apiURL}/users/${userId}`).pipe(
        map((res: any) => {
          // فقط بخش اطلاعات کاربر را برمی‌گردانیم
          return res.data.user;
        }),
      );
    } catch (error) {
      // اگر هر جای کار (مثلاً باز کردن توکن) به مشکل خورد، خطا را چاپ کن و null برگردان.
      console.error('Error decoding JWT token:', error);
      return of(null);
    }
  }

  /**
   * تغییر رمز عبور کاربر
   *
   * @param {any} data - شامل رمز عبور فعلی و رمز عبور جدید.
   * @returns {Observable<any>} نتیجه عملیات.
   */
  changePassword(data: any): Observable<any> {
    // استفاده از متد PATCH:
    // چون فقط می‌خواهیم "بخشی" از اطلاعات کاربر (یعنی پسورد) را آپدیت کنیم، از PATCH استفاده می‌کنیم
    // (برخلاف PUT که معمولاً کل اطلاعات را عوض می‌کند).
    return this.http.patch(`${this.apiURL}/users/updateMyPassword`, data);
  }

  /**
   * دریافت تاریخچه فعالیت‌های کاربر
   *
   * این متد لیست "درخواست‌های پذیرش" و "رزرو مشاوره" را از سرور می‌گیرد،
   * آن‌ها را با هم ترکیب می‌کند و بر اساس تاریخ (از جدید به قدیم) مرتب می‌کند.
   *
   * @returns {Observable<any[]>} لیست مرتب شده‌ی تمام فعالیت‌ها.
   */
  getUserHistory(): Observable<any[]> {
    return this.http.get(`${this.apiURL}/users/history`).pipe(
      map((res: any) => {
        const data = res.data;

        // 1. آماده‌سازی لیست پذیرش‌ها (Applications):
        // اطلاعات را به فرمت دلخواه تبدیل می‌کنیم تا در لیست واحد قابل نمایش باشد.
        const appList = (data.applications || []).map((item: any) => ({
          id: item._id,
          type: 'application', // نشانگر نوع: این آیتم یک "پذیرش تحصیلی" است
          typeLabel: 'پذیرش تحصیلی', // متنی که به کاربر نمایش می‌دهیم
          name: item.university?.name || 'نامشخص', // نام دانشگاه
          date: item.appliedAt, // تاریخ درخواست
          status: item.status, // وضعیت (تایید شده، در انتظار و...)
          logo: item.university?.logoUrl, // لوگوی دانشگاه (برای نمایش در UI)
        }));

        // 2. آماده‌سازی لیست مشاوره‌ها (Consultations):
        // شبیه مرحله قبل، اما برای مشاوره‌ها.
        const consultList = (data.consultations || []).map((item: any) => ({
          id: item._id,
          type: 'consultation', // نشانگر نوع: این آیتم یک "مشاوره" است
          typeLabel: 'رزرو مشاوره', // متنی که به کاربر نمایش می‌دهیم
          name: item.consultant?.name || 'نامشخص', // نام مشاور
          date: item.scheduledAt, // تاریخ رزرو
          status: item.status,
          logo: item.consultant?.logoUrl,
        }));

        // 3. ترکیب دو لیست (Merge):
        // با استفاده از Spread Operator (...) دو آرایه را در یک آرایه واحد می‌ریزیم.
        const combinedHistory = [...appList, ...consultList];

        // 4. مرتب‌سازی بر اساس تاریخ (Sort):
        // لیست نهایی را طوری مرتب می‌کنیم که جدیدترین فعالیت‌ها (تاریخ بالاتر) اول لیست باشند.
        return combinedHistory.sort((a, b) => {
          // تبدیل تاریخ‌ها به عدد (Timestamp) و مقایسه آن‌ها
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }),
    );
  }

  /**
   * این متد وظیفه برقراری ارتباط با سرور (Back-end) برای حذف فیزیکی یک مدرک را بر عهده دارد.
   * از متد HTTP DELETE برای ارسال این درخواست استفاده می‌شود.
   * * @param {string} id - شناسه منحصربه‌فرد مدرکی که قرار است از پایگاه داده حذف شود
   */
  deleteDocument(id: string) {
    // ارسال درخواست حذف به آدرس مشخص (API Endpoint)
    // عبارت ${this.apiURL} آدرس پایه سرور و ${id} متغیری است که مشخص می‌کند کدام سند حذف شود
    this.http.delete(`${this.apiURL}/users/delete-document/${id}`).subscribe((res) => {
      // متد subscribe مانند یک "گوش‌به‌زنگ" عمل می‌کند؛
      // یعنی منتظر می‌ماند تا سرور پاسخ را بفرستد و سپس کدهای داخل این بخش اجرا می‌شوند.

      // چاپ کردن پاسخ سرور در کنسول مرورگر برای اطمینان از صحت انجام عملیات (Debugging)
      console.log(res);
    });
  }
}
