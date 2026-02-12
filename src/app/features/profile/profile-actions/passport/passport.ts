import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiDialog, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import { Subject, switchMap, Observable, of, timer, map, finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Empty } from '../../../../shared/components/empty/empty';
import { environment } from '../../../../../environments/environment.development';
import { JalaliPipe } from '../../../../shared/pipes/jalali-pipe';

/**
 * کامپوننت مدیریت پاسپورت (Passport Component)
 *
 * وظایف اصلی:
 * 1. نمایش لیست مدارک پاسپورت کاربر.
 * 2. امکان آپلود تصویر پاسپورت جدید.
 * 3. مدیریت وضعیت آپلود (در حال بارگذاری، خطا، موفقیت).
 */
@Component({
  selector: 'app-passport', // تگ استفاده در HTML: <app-passport></app-passport>
  imports: [
    TuiIcon,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    FormsModule,
    TuiButton,
    TuiIcon,
    RouterLink,
    TuiDialog,
    TuiHint,
    AsyncPipe,
    TuiFiles,
    Empty,
    JalaliPipe,
  ],
  templateUrl: './passport.html',
  styleUrl: './passport.scss',
  host: {
    // کلاس‌های ظاهری برای بدنه اصلی کامپوننت (فاصله داخلی)
    class: 'p-4 ps-5 pl-5  block',
  },
})
export class Passport implements OnInit {
  /**
   * وضعیت باز یا بسته بودن پنجره پاپ‌آپ (Dialog).
   * اگر true باشد، فرم آپلود نمایش داده می‌شود.
   */
  protected open = false;

  /** فرم کلی (که البته در اینجا بیشتر از کنترل تکی فایل استفاده شده است) */
  passportForm = new FormGroup({});

  // تزریق وابستگی‌ها (Dependency Injection)
  private http = inject(HttpClient); // برای ارسال درخواست به سرور
  private route = inject(ActivatedRoute); // برای گرفتن اطلاعات از آدرس صفحه (Route)

  /** اطلاعات کاربر جاری که از Route گرفته می‌شود */
  user: any;

  /** آدرس پایه سرور (از فایل environment) */
  baseUrl: string = environment.baseUrl;

  /**
   * نوع مدرک.
   * چون سیستم آپلود ما کلی است، اینجا مشخص می‌کنیم که داریم "passport" می‌فرستیم.
   */
  docType: string = 'passport';

  /**
   * متد راه‌اندازی اولیه (Lifecycle Hook).
   * زمانی که کامپوننت لود می‌شود، اطلاعات کاربر را از حافظه Route می‌خواند.
   */
  ngOnInit(): void {
    // snapshot.data['user']: اطلاعاتی که قبل از باز شدن صفحه توسط Resolver گرفته شده.
    this.user = this.route.parent?.snapshot.data['user'];
    console.log(this.user);
  }

  /** نمایش دیالوگ آپلود */
  showDialog() {
    this.open = true;
  }

  /** بستن دیالوگ آپلود و پاک کردن فایل انتخاب شده */
  closeDialog() {
    this.open = false;
    this.removeFile();
  }

  /**
   * کنترلر فرم برای اینپوت فایل.
   * Validators.required یعنی انتخاب فایل اجباری است.
   * نوع آن TuiFileLike است (فرمت خاص کتابخانه Taiga UI).
   */
  protected readonly control = new FormControl<TuiFileLike | null>(null, Validators.required);

  // --- متغیرهای مربوط به وضعیت فایل (RxJS) ---

  /** استریمی برای مدیریت فایل‌هایی که آپلودشان شکست خورده */
  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();

  /** استریمی برای نمایش وضعیت "در حال بارگذاری" (Loading) */
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();

  /**
   * استریمی که وقتی فایل انتخاب شد، آن را پردازش می‌کند.
   * از switchMap استفاده شده تا اگر کاربر تند تند فایل عوض کرد، فقط آخری پردازش شود.
   */
  protected readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => this.processFile(file)),
  );

  /** حذف فایل انتخاب شده از کنترلر فرم */
  protected removeFile(): void {
    this.control.setValue(null);
  }

  /**
   * شبیه‌سازی پردازش فایل قبل از ارسال نهایی.
   *
   * @description
   * این تابع یک تأخیر مصنوعی (Timer) ایجاد می‌کند تا کاربر حس کند فایل در حال بررسی است.
   * همچنین به صورت تصادفی (Math.random) ممکن است خطا تولید کند (احتمالاً برای تست UI).
   */
  protected processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null); // ریست کردن خطاها

    if (this.control.invalid || !file) {
      return of(null);
    }

    // اعلام وضعیت لودینگ
    this.loadingFiles$.next(file);

    // ایجاد یک تاخیر 1 ثانیه‌ای و سپس بازگرداندن فایل
    return timer(1000).pipe(
      map(() => {
        // شبیه‌سازی خطا برای تست (50% شانس موفقیت)
        if (Math.random() > 0.5) {
          return file;
        }

        this.failedFiles$.next(file); // فایل شکست خورد
        return null;
      }),
      finalize(() => this.loadingFiles$.next(null)), // پایان لودینگ
    );
  }

  // --- منطق اصلی ارسال به سرور (SUBMIT LOGIC) ---

  /**
   * ارسال فایل به سمت سرور.
   *
   * @param observer - آبجکتی که وضعیت آپلود را در کامپوننت Taiga UI مدیریت می‌کند.
   */
  onSubmit(observer: any): void {
    const rawFile = this.control.value;
    if (!rawFile) return;

    // تبدیل فرمت فایل کتابخانه به فایل استاندارد جاوااسکریپت
    const file = rawFile as File;

    // ساختن یک بسته پستی (FormData) برای ارسال فایل
    // چون فایل را نمی‌توان مثل متن معمولی JSON فرستاد، باید از FormData استفاده کرد.
    const formData = new FormData();

    // 1. گذاشتن فایل داخل بسته
    formData.append('document', file);

    // 2. گذاشتن نوع مدرک (passport) داخل بسته
    // این باعث می‌شود سرور بفهمد این عکس مربوط به پاسپورت است.
    formData.append('docType', this.docType);

    // شروع نمایش لودینگ
    this.loadingFiles$.next(rawFile);

    // 3. ارسال به آدرس جنریک آپلود (Generic Endpoint)
    // به جای اینکه برای هر مدرک یک آدرس جدا داشته باشیم، همه را به upload-document می‌فرستیم
    this.http
      .post('http://localhost:3000/api/v1/users/upload-document', formData)
      .pipe(finalize(() => this.loadingFiles$.next(null))) // وقتی کار تمام شد (چه درست چه غلط)، لودینگ را بردار
      .subscribe({
        next: (res) => {
          console.log(`${this.docType} uploaded successfully`, res);
          observer.complete(); // به UI بگو کار تمام شد
          this.removeFile(); // فایل را از اینپوت پاک کن تا برای بعدی آماده شود
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.failedFiles$.next(rawFile); // به UI بگو خطا رخ داد
        },
      });
  }

  /**
   * بررسی می‌کند آیا کاربر قبلاً پاسپورت آپلود کرده یا خیر.
   *
   * @param documents - لیست تمام مدارک کاربر
   * @returns {boolean} - اگر پاسپورت داشت true، وگرنه false
   */
  hasPassport(documents: any[]): boolean {
    // some: یعنی "آیا حداقل یکی" از مدارک، نوعش passport است؟
    return documents?.some((doc) => doc.docType === 'passport') || false;
  }

  /**
   * گرفتن لیست فایل‌های پاسپورت از بین کل مدارک.
   *
   * @param documents - لیست مدارک
   * @returns {any[]} - آرایه‌ای فقط شامل پاسپورت‌ها
   */
  getPassportDocs(documents: any[]): any[] {
    // filter: مدارک را الک می‌کند و فقط آن‌هایی که پاسپورت هستند را نگه می‌دارد.
    return documents ? documents.filter((doc) => doc.docType === 'passport') : [];
  }
}
