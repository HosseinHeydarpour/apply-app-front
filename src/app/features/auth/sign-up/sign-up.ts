import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TUI_IS_IOS } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone, TuiTextarea } from '@taiga-ui/kit';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { finalize } from 'rxjs';

/**
 * کامپوننت ثبت نام (Sign Up)
 * مسئولیت: نمایش فرم ثبت نام، اعتبارسنجی ورودی‌ها و ارسال اطلاعات کاربر به سرور.
 */
@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule, // ماژول مورد نیاز برای کار با فرم‌های پیشرفته (Reactive Forms)
    TuiTextarea,
    TuiTextfield,
    FormsModule,
    TuiInputPhone,
    TuiButton,
    TuiIcon,
    RouterLink,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  host: {
    class: 'pt-16 pb-16 px-4 block ',
  },
})
export class SignUp {
  /**
   * تعریف فرم ثبت نام با استفاده از FormGroup.
   * این متغیر تمام فیلدهای فرم و قوانین اعتبارسنجی (مثل اجباری بودن) را در خود نگه می‌دارد.
   */
  registerForm = new FormGroup(
    {
      // نام کاربر: فیلد متنی که پر کردن آن اجباری است (Validators.required)
      firstName: new FormControl('', [Validators.required]),

      // نام خانوادگی: فیلد متنی اجباری
      lastName: new FormControl('', [Validators.required]),

      // ایمیل: اجباری است و حتما باید فرمت استاندارد ایمیل داشته باشد (Validators.email)
      email: new FormControl('', [Validators.required, Validators.email]),

      // شماره موبایل: اجباری است و باید حداقل ۱۲ کاراکتر باشد (با احتساب +98)
      // Add phone control here with default +98
      phone: new FormControl('', [Validators.required, Validators.minLength(12)]),

      // رمز عبور: اجباری و حداقل ۸ کاراکتر
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),

      // تکرار رمز عبور: فقط اجباری بودن چک می‌شود، یکی بودن رمزها در سطح گروه چک می‌شود
      passwordConfirm: new FormControl('', [Validators.required]),
    },
    {
      // اعتبارسنجی سفارشی برای کل گروه فرم
      // این تابع چک می‌کند که "رمز عبور" و "تکرار آن" یکسان باشند
      validators: this.matchPasswords,
    },
  );

  /**
   * تزریق سرویس احراز هویت (Auth Service) برای ارتباط با سرور
   * معادل نوشتن constructor(private authService: Auth) است.
   */
  authService = inject(Auth);

  /**
   * متغیری از نوع سیگنال (Signal) برای مدیریت وضعیت لودینگ.
   * وقتی true باشد، دکمه ثبت نام حالت چرخشی (Spinner) می‌گیرد.
   */
  isLoading = signal(false);

  /**
   * تزریق روتر (Router) برای هدایت کاربر به صفحات دیگر (مثل صفحه اصلی) بعد از ثبت نام موفق.
   */
  router = inject(Router);

  // بررسی می‌کند که آیا دستگاه کاربر iOS (آیفون/آیپد) است یا خیر (برای تنظیمات کیبورد)
  protected readonly isIos = inject(TUI_IS_IOS);

  // مقدار پیش‌فرض برای فیلد شماره تلفن (کد ایران)
  // Change default value to Iran code
  public value = '+98';

  /**
   * الگوی مجاز (Regex) برای ورودی شماره تلفن.
   * اگر دستگاه iOS باشد، الگوی خاصی برمی‌گرداند تا کیبورد درست باز شود.
   */
  protected get pattern(): string | null {
    // IOS pattern: allows +98 and spaces/dashes
    return this.isIos ? '+98[- ]?[0-9-]{1,20}' : null;
  }

  /**
   * متد ارسال فرم (Submit)
   * زمانی که کاربر دکمه "ثبت نام" را کلیک می‌کند، این تابع اجرا می‌شود.
   *
   * @returns {void}
   */
  onSubmit() {
    // قدم ۱: اگر فرم نامعتبر است (مثلاً ایمیل اشتباه است یا فیلدی خالی است)، کار را متوقف کن.
    if (this.registerForm.invalid) return;

    // قدم ۲: وضعیت لودینگ را فعال کن تا کاربر متوجه شود سیستم در حال پردازش است.
    this.isLoading.set(true);

    // قدم ۳: ارسال اطلاعات فرم (this.registerForm.value) به متد signUp در سرویس Auth
    this.authService
      .signUp(this.registerForm.value)
      .pipe(
        // finalize: چه درخواست موفق شود چه شکست بخورد، در نهایت این خط اجرا می‌شود.
        // اینجا لودینگ را غیرفعال می‌کنیم تا دکمه به حالت اول برگردد.
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        // next: اگر ثبت نام با موفقیت انجام شد
        next: () => {
          // Success: Redirect to Profile (or Home)
          // هدایت کاربر به صفحه اصلی (روت '/')
          this.router.navigate(['/']);
        },
        // error: اگر خطایی رخ داد (مثلاً ایمیل تکراری بود)
        error: (err) => {
          console.error('Signup failed', err);
          // Handle error (e.g., "Email already exists")
          // اینجا می‌توانیم پیامی به کاربر نشان دهیم (فعلاً فقط در کنسول لاگ می‌شود)
        },
      });
  }

  /**
   * تابع اعتبارسنجی سفارشی (Custom Validator)
   * هدف: بررسی یکسان بودن "رمز عبور" و "تکرار رمز عبور".
   *
   * @param {AbstractControl} group - کل گروه فرم که شامل تمام فیلدهاست
   * @returns {object | null} - اگر رمزها یکی نباشند یک آبجکت خطا برمی‌گرداند، وگرنه null (یعنی خطایی نیست).
   */
  matchPasswords(group: AbstractControl): { [key: string]: boolean } | null {
    // دریافت مقدار رمز عبور
    const password = group.get('password')?.value;
    // دریافت مقدار تکرار رمز عبور
    const confirm = group.get('passwordConfirm')?.value;

    // اگر برابر بودند، null برگردان (یعنی اوکی است)، در غیر این صورت خطای notMatching برگردان
    return password === confirm ? null : { notMatching: true };
  }

  /**
   * یک Getter کمکی برای دسترسی آسان‌تر به کنترل‌های فرم در فایل HTML.
   * به جای نوشتن `registerForm.controls.email` می‌توانیم بنویسیم `f.email`.
   *
   * @returns {object} - لیست کنترل‌های فرم
   */
  get f() {
    return this.registerForm.controls;
  }
}
