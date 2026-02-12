import { Component, inject, OnInit } from '@angular/core';
import { ProfileCard } from './profile-card/profile-card';
import { ProfileActions } from './profile-actions/profile-actions';
import { ActivatedRoute } from '@angular/router';

/**
 * کامپوننت Profile (پروفایل کاربر)
 *
 * این کامپوننت صفحه اصلی پروفایل است که اطلاعات کلی کاربر را نمایش می‌دهد.
 * شامل دو بخش اصلی است: کارت مشخصات (ProfileCard) و دکمه‌های عملیاتی (ProfileActions).
 */
@Component({
  selector: 'app-profile',
  imports: [ProfileCard, ProfileActions],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  /**
   * ابزار ActivatedRoute:
   * این ابزار به ما اجازه می‌دهد بفهمیم الان در چه آدرسی هستیم و چه اطلاعاتی به این آدرس متصل است.
   */
  private route = inject(ActivatedRoute);

  /**
   * متغیری برای نگهداری اطلاعات کاربر (مثل نام، ایمیل، عکس).
   * نوع آن any است یعنی هر ساختاری می‌تواند داشته باشد.
   */
  userData: any;

  /**
   * متد ngOnInit:
   * این تابع بلافاصله پس از ساخته شدن کامپوننت اجرا می‌شود.
   * وظیفه: دریافت اطلاعات کاربر از "مسیر والد" (Parent Route).
   */
  ngOnInit() {
    // 1. دسترسی به داده‌های مسیر بالاتر (Parent)
    // توضیح مهم: چرا از .parent استفاده کردیم؟
    // چون معمولاً اطلاعات کاربر در لایه اصلی (مثلاً پنل کاربری) دریافت می‌شود و این صفحه فقط یک زیرمجموعه است.
    // پس باید یک پله بالاتر برویم تا به دیتای 'user' برسیم.

    // علامت سوال (parent?) یعنی: اگر والدی وجود داشت، ادامه بده (جلوگیری از خطا).
    this.userData = this.route.parent?.snapshot.data['user'];
  }
}
