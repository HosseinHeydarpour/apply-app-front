import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone, TuiTextarea } from '@taiga-ui/kit';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { finalize } from 'rxjs';

/**
 * @description
 * کامپوننت ورود به سیستم (Login Page).
 * این کلاس مسئولیت مدیریت فرم ورود، اعتبارسنجی اطلاعات کاربر و ارسال آن‌ها به سرور را دارد.
 *
 * وظایف اصلی:
 * 1. ساخت فرم ورود (ایمیل و رمز عبور).
 * 2. چک کردن صحت اطلاعات (Validation).
 * 3. ارسال درخواست ورود به سرور و مدیریت حالت لودینگ (Loading).
 */
@Component({
  selector: 'app-login',
  // ایمپورت ماژول‌های لازم برای کار با فرم‌ها و دکمه‌ها
  imports: [CommonModule, ReactiveFormsModule, TuiTextfield, FormsModule, TuiButton, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  // اضافه کردن کلاس CSS به تگ اصلی کامپوننت (<app-login>)
  host: {
    class: 'pt-16 block',
  },
})
export class Login {
  /**
   * تعریف فرم ورود با استفاده از Reactive Forms.
   * FormGroup: کل فرم را نگه می‌دارد.
   * FormControl: هر کدام از فیلدهای ورودی (مثل ایمیل) است.
   * Validators: قوانین اعتبارسنجی (مثل اجباری بودن یا حداقل طول رمز).
   */
  loginForm = new FormGroup({
    // فیلد ایمیل: هم اجباری است و هم باید فرمت ایمیل داشته باشد.
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    // فیلد رمز عبور: هم اجباری است و هم باید حداقل 8 کاراکتر باشد.
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  // تزریق سرویس احراز هویت (برای لاگین کردن)
  authService = inject(Auth);

  // تزریق سرویس مسیریابی (برای انتقال کاربر به صفحه پروفایل بعد از ورود)
  router = inject(Router);

  /**
   * متغیر سیگنال (Signal) برای مدیریت وضعیت "در حال بارگذاری".
   * وقتی کاربر دکمه ورود را می‌زند، این مقدار true می‌شود تا دکمه غیرفعال شود یا چرخشگر نشان داده شود.
   * استفاده از signal ویژگی جدید و پرسرعت انگولار است.
   */
  isLoading = signal(false);

  /**
   * @function submit
   * @description
   * این متد وقتی کاربر دکمه "ورود" را کلیک می‌کند اجرا می‌شود.
   */
  submit() {
    // 1. چک می‌کنیم آیا فرم معتبر است؟ (ایمیل درست است؟ رمز پر شده؟)
    if (this.loginForm.valid) {
      // 2. وضعیت لودینگ را فعال می‌کنیم (نمایش اسپینر روی دکمه)
      this.isLoading.set(true);

      // 3. ارسال اطلاعات فرم به متد login در سرویس Auth
      this.authService
        .login(this.loginForm.value)
        .pipe(
          // finalize: این بخش چه لاگین موفق باشد چه خطا دهد، اجرا می‌شود.
          // هدف: خاموش کردن وضعیت لودینگ پس از پایان کار.
          finalize(() => this.isLoading.set(false)),
        )
        .subscribe({
          // next: اگر سرور پاسخ مثبت داد (ورود موفق)
          next: () => {
            // کاربر را به صفحه پروفایل هدایت می‌کنیم
            this.router.navigate(['/profile']);
          },
          // error: اگر سرور خطا داد (مثلاً رمز اشتباه بود)
          error: (err) => {
            // خطا را در کنسول چاپ می‌کنیم (می‌توان اینجا پیام خطا هم نمایش داد)
            console.error('Login failed', err);
          },
        });
    } else {
      // اگر فرم معتبر نبود (مثلاً کاربر فیلدی را خالی گذاشته بود):
      // همه فیلدها را به عنوان "لمس شده" علامت می‌زنیم تا پیام‌های خطای قرمز رنگ زیر آن‌ها نمایش داده شود.
      this.loginForm.markAllAsTouched();
    }
  }

  /**
   * @function f
   * @description
   * یک متد کمکی (Getter) کوتاه.
   * به جای اینکه در HTML بنویسیم loginForm.controls.email، فقط می‌نویسیم f.email
   * این کار کد HTML را تمیزتر می‌کند.
   */
  get f() {
    return this.loginForm.controls;
  }
}
