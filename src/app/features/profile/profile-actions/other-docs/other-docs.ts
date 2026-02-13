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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiButton, TuiDialog, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import { Subject, switchMap, Observable, of, timer, map, finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { Empty } from '../../../../shared/components/empty/empty';
import { JalaliPipe } from '../../../../shared/pipes/jalali-pipe';
import { UserService } from '../../../../core/services/user-service';

/**
 * کامپوننت مدیریت سایر مدارک (Other Documents)
 *
 * تفاوت این کامپوننت با پاسپورت این است که کاربر باید برای مدرک خود یک "عنوان" (Title) هم وارد کند.
 * مثلاً کاربر عکس مدرک تحصیلی را آپلود می‌کند و عنوانش را می‌نویسد: "لیسانس کامپیوتر".
 */
@Component({
  selector: 'app-other-docs',
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
  templateUrl: './other-docs.html',
  styleUrl: './other-docs.scss',
  host: {
    class: 'p-4 ps-5 pl-5  block',
  },
})
export class OtherDocs implements OnInit {
  /** وضعیت نمایش دیالوگ آپلود (باز/بسته) */
  protected open = false;

  /**
   * فرم مربوط به اطلاعات متنی مدرک.
   * در اینجا فقط یک فیلد 'title' داریم که پر کردن آن اجباری (Required) است.
   */
  otherDocsForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  /** نوع مدرک که برای سرور ارسال می‌شود (ثابت: 'other') */
  docType: string = 'other';

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  user: any;
  baseUrl: string = environment.baseUrl;
  apiUrl: string = environment.apiUrl;

  ngOnInit(): void {
    // دریافت اطلاعات کاربر از داده‌های Resolver (قبل از لود شدن صفحه)
    this.user = this.route.parent?.snapshot.data['user'];
    console.log(this.user);
  }

  showDialog() {
    this.open = true;
  }

  closeDialog() {
    this.open = false;
    this.removeFile();
  }

  /**
   * کنترلر جداگانه برای فایل.
   * چرا جدا؟ چون کامپوننت فایل Taiga UI ترجیح می‌دهد کنترلر خودش را داشته باشد.
   */
  protected readonly control = new FormControl<TuiFileLike | null>(null, Validators.required);

  // --- متغیرهای مربوط به وضعیت فایل (RxJS) ---
  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();

  /** پردازش فایل بلافاصله بعد از انتخاب (نمایش لودینگ و ...) */
  protected readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => this.processFile(file)),
  );

  protected removeFile(): void {
    this.control.setValue(null);
  }

  /**
   * شبیه‌سازی آپلود و بررسی فایل (برای نمایش انیمیشن لودینگ).
   */
  protected processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);

    if (this.control.invalid || !file) {
      return of(null);
    }

    this.loadingFiles$.next(file);

    // ایجاد تأخیر مصنوعی ۱ ثانیه‌ای
    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.5) {
          return file;
        }
        this.failedFiles$.next(file);
        return null;
      }),
      finalize(() => this.loadingFiles$.next(null)),
    );
  }

  /**
   * یک میانبر (Getter) برای دسترسی راحت‌تر به کنترل‌های فرم در HTML.
   * مثلاً به جای نوشتن `otherDocsForm.controls.title` فقط می‌نویسیم `f.title`.
   */
  get f() {
    return this.otherDocsForm.controls;
  }

  // --- منطق ارسال به سرور (SUBMIT LOGIC) ---

  /**
   * ارسال فرم (فایل + عنوان) به سرور.
   */
  onSubmit(observer: any): void {
    // قدم اول: بررسی اعتبار فرم متنی (آیا عنوان وارد شده؟)
    if (this.otherDocsForm.invalid) {
      // اگر فرم نامعتبر بود، همه فیلدها را "لمس شده" علامت بزن تا ارورهای قرمز رنگ در UI ظاهر شوند.
      this.otherDocsForm.markAllAsTouched();
      return; // توقف عملیات
    }

    // قدم دوم: بررسی وجود فایل
    const rawFile = this.control.value;
    if (!rawFile) return;

    const file = rawFile as File;
    // گرفتن مقدار عنوان از فرم
    const title = this.otherDocsForm.get('title')?.value;

    // قدم سوم: ساخت بسته پستی (FormData)
    const formData = new FormData();

    formData.append('document', file); // فایل
    formData.append('docType', this.docType); // نوع مدرک (other)

    // ✅ نکته مهم: اضافه کردن عنوان به بسته ارسالی
    // اگر تایتل خالی بود (که البته با شرط بالا نباید باشد)، یک رشته خالی بفرست.
    formData.append('title', title || '');

    // شروع لودینگ
    this.loadingFiles$.next(rawFile);

    // ارسال درخواست POST
    this.http
      .post(`${this.apiUrl}/users/upload-document`, formData)
      .pipe(finalize(() => this.loadingFiles$.next(null))) // پایان لودینگ در هر صورت
      .subscribe({
        next: (res) => {
          console.log(`Document uploaded successfully`, res);
          observer.complete(); // بستن وضعیت آپلودر UI
          this.removeFile(); // پاک کردن فایل از حافظه
          this.otherDocsForm.reset(); // پاک کردن فیلد عنوان برای استفاده بعدی
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.failedFiles$.next(rawFile);
        },
      });
  }

  /**
   * بررسی می‌کند آیا کاربر در مدارکش، مدرکی از نوع 'other' دارد؟
   */
  hasOther(documents: any[]): boolean {
    return documents?.some((doc) => doc.docType === 'other') || false;
  }

  /**
   * فیلتر کردن و نمایش فقط مدارک متفرقه (Other Documents).
   */
  getOtherDocs(documents: any[]): any[] {
    return documents ? documents.filter((doc) => doc.docType === 'other') : [];
  }

  /**
   * این متد مسئول حذف گذرنامه (Passport) کاربر از سیستم است.
   * با استفاده از شناسه منحصربه‌فرد، درخواست حذف را به سرویس اسناد می‌فرستد.
   * * @param {string} id - شناسه اختصاصی گذرنامه‌ای که باید حذف شود
   * @returns {void} این تابع خروجی مستقیم ندارد و فقط یک عملیات را اجرا می‌کند
   */
  deleteDocument(id: string) {
    // فراخوانی متد deleteDocument از سرویس کاربران (userService)
    // این خط به برنامه می‌گوید: "سندی که این کد شناسایی (id) را دارد، از پایگاه داده حذف کن"
    this.userService.deleteDocument(id);
  }
}
