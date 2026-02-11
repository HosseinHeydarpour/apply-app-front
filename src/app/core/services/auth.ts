import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

/**
 * سرویس احراز هویت (Auth Service)
 * ------------------------------
 * این کلاس مسئولیت تمام کارهای مربوط به ورود، خروج، ثبت‌نام و مدیریت "توکن" کاربر را بر عهده دارد.
 *
 * توکن (Token) مثل "کارت شناسایی دیجیتالی" است که سرور به کاربر می‌دهد تا در درخواست‌های بعدی
 * او را بشناسد.
 *
 * @class Auth
 */
@Injectable({
  providedIn: 'root', // یعنی این سرویس در کل برنامه در دسترس است.
})
export class Auth {
  // ابزار برقراری ارتباط با سرور
  private http = inject(HttpClient);
  // آدرس پایه سرور (Backend) که از فایل تنظیمات خوانده می‌شود
  private apiUrl = environment.apiUrl;
  // متغیری برای نگهداری موقت توکن در حافظه برنامه
  private tokenKey = '';
  // ابزار برای جابجایی بین صفحات (مثلاً رفتن به صفحه اصلی بعد از خروج)
  private router = inject(Router);

  /**
   * سیگنال وضعیت احراز هویت (Signal)
   *
   * سیگنال یک ویژگی جدید و قدرتمند در انگولار است. مثل یک "چراغ راهنما" عمل می‌کند.
   * هر جای برنامه که به این متغیر گوش دهد، به محض اینکه مقدارش (True/False) تغییر کند،
   * خودکار آپدیت می‌شود.
   *
   * مقدار اولیه آن با بررسی اینکه "آیا توکن معتبر داریم؟" تنظیم می‌شود.
   */
  public isAuthenticated = signal<boolean>(this.hasValidToken());

  /**
   * ورود کاربر (Login)
   *
   * نام کاربری و رمز عبور را به سرور می‌فرستد. اگر درست بود، توکن دریافتی را ذخیره می‌کند.
   *
   * @param {any} credentials - اطلاعات ورود (مثل ایمیل و پسورد)
   * @returns {Observable} نتیجه درخواست ورود.
   */
  login(credentials: any) {
    // ارسال درخواست POST به آدرس login
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/login`, credentials).pipe(
      // متد tap اجازه می‌دهد قبل از اینکه نتیجه به کامپوننت برسد، ما کارهای پشت صحنه را انجام دهیم
      tap((response) => {
        this.tokenKey = response.token;
        // 1. ذخیره توکن در حافظه مرورگر (LocalStorage) تا اگر صفحه رفرش شد، کاربر بیرون نیفتد
        localStorage.setItem('token', response.token);

        // 2. روشن کردن چراغ سیگنال!
        // با true کردن این، منوهای برنامه (مثلاً دکمه پروفایل) بلافاصله ظاهر می‌شوند.
        this.isAuthenticated.set(true);
      }),
    );
  }

  /**
   * خروج کاربر (Logout)
   *
   * توکن را پاک می‌کند و وضعیت کاربر را به "مهمان" تغییر می‌دهد.
   */
  logout() {
    this.tokenKey = '';
    // 1. پاک کردن توکن از حافظه مرورگر (دور انداختن کارت شناسایی)
    localStorage.removeItem('token');

    // 2. خاموش کردن چراغ سیگنال
    // با false کردن این، دکمه‌های مخصوص اعضا پنهان می‌شوند.
    this.isAuthenticated.set(false);

    // 3. هدایت کاربر به صفحه اصلی (Home)
    this.router.navigate(['/']);
  }

  /**
   * دریافت توکن فعلی
   *
   * @returns {string | null} توکن ذخیره شده یا null (اگر توکنی نباشد).
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * پاک کردن توکن (بدون عملیات اضافی خروج)
   */
  clearToken() {
    localStorage.removeItem('token');
  }

  /**
   * ثبت‌نام کاربر جدید (Sign Up)
   *
   * اطلاعات کاربر را می‌فرستد و اگر ثبت‌نام موفق بود، بلافاصله کاربر را لاگین می‌کند.
   *
   * @param {any} userData - مشخصات کاربر (نام، ایمیل، رمز و ...)
   * @returns {Observable} نتیجه درخواست ثبت‌نام.
   */
  signUp(userData: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/signup`, userData).pipe(
      tap((response) => {
        // احتیاط: قبل از تنظیم توکن جدید، توکن قبلی (اگر هست) را پاک می‌کنیم
        this.clearToken();

        // اگر سرور بعد از ثبت‌نام به ما توکن داد (یعنی ثبت‌نام موفق بوده):
        if (response.token) {
          // توکن را ذخیره کن
          localStorage.setItem('token', response.token);
          // چراغ وضعیت را سبز (True) کن تا کاربر وارد شده محسوب شود
          this.isAuthenticated.set(true);
        }
      }),
    );
  }

  /**
   * تنظیم دستی توکن جدید
   *
   * گاهی اوقات توکن از جای دیگری (مثلاً لینک ایمیل یا لاگین گوگل) می‌آید و ما باید دستی آن را ست کنیم.
   *
   * @param {string} token - توکن جدید
   */
  setNewToken(token: string) {
    this.clearToken();
    this.tokenKey = token;
    localStorage.setItem('token', token);

    // مهم: حتماً باید سیگنال را آپدیت کنیم تا UI برنامه بفهمد توکن معتبر داریم
    this.isAuthenticated.set(true);
  }

  /**
   * بررسی اعتبار توکن (Helper Method)
   *
   * این متد خصوصی فقط هنگام لود شدن برنامه اجرا می‌شود تا ببینیم توکنی که در مرورگر مانده،
   * هنوز اعتبار دارد یا منقضی شده است.
   *
   * @private
   * @returns {boolean} اگر توکن معتبر باشد true برمی‌گرداند.
   */
  private hasValidToken(): boolean {
    // گرفتن توکن از حافظه مرورگر
    const token = localStorage.getItem('token');
    // اگر توکنی نیست، پس کاربر لاگین نیست
    if (!token) return false;

    try {
      // استفاده از کتابخانه jwt-decode برای خواندن محتویات توکن (مثل تاریخ انضا)
      const decoded: any = jwtDecode(token);

      // بررسی تاریخ انقضا (Expiration Time)
      // exp زمان انقضا به ثانیه است، آن را در 1000 ضرب می‌کنیم تا به میلی‌ثانیه تبدیل شود
      // و با زمان فعلی (Date.now) مقایسه می‌کنیم.
      const isExpired = decoded.exp * 1000 < Date.now();

      // اگر منقضی نشده (!isExpired) یعنی معتبر است.
      return !isExpired;
    } catch (error) {
      // اگر توکن خراب بود یا فرمت درستی نداشت، معتبر نیست.
      return false;
    }
  }
}
