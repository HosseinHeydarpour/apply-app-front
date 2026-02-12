import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TUI_IS_IOS, TuiAutoFocus } from '@taiga-ui/cdk';
import { TuiButton, TuiDialog, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFileLike, TuiFiles, TuiInputPhone, TuiTextarea } from '@taiga-ui/kit';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, switchMap, Observable, of, timer, map, finalize } from 'rxjs';
import { UserService } from '../../../../core/services/user-service';
import { Auth } from '../../../../core/services/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

/**
 * @class Edit
 * @description این کلاس مسئول مدیریت صفحه "ویرایش پروفایل" است.
 * دو کار اصلی انجام می‌دهد: ۱. تغییر رمز عبور کاربر ۲. آپلود تصویر پروفایل جدید.
 */
@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextarea,
    TuiTextfield,
    FormsModule,
    TuiInputPhone,
    TuiButton,
    TuiIcon,
    RouterLink,
    TuiAutoFocus,
    TuiDialog,
    TuiHint,
    AsyncPipe,
    TuiFiles,
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
  host: {
    class: 'pt-16 block',
  },
})
export class Edit {
  /**
   * @property editForm
   * @description تعریف یک فرم برای تغییر رمز عبور.
   * در اینجا قوانینی (Validators) مثل اجباری بودن و حداقل طول ۸ کاراکتر را تعیین کرده‌ایم.
   */
  editForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl('', [Validators.required]),
      passwordCurrent: new FormControl('', [Validators.required]),
    },
    { validators: this.matchPasswords }, // اضافه کردن قانون اختصاصی برای چک کردن همخوانی رمزها
  );

  // ابزارهای مورد نیاز برای ارتباط با اینترنت و دریافت اطلاعات از آدرس صفحه
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  baseURL = environment.baseUrl;
  route = inject(ActivatedRoute);

  protected open = false; // متغیری برای باز یا بسته کردن پنجره (Dialog) آپلود عکس
  protected userService = inject(UserService); // سرویس مدیریت اطلاعات کاربر
  protected authService = inject(Auth); // سرویس مربوط به احراز هویت و توکن

  user: any; // متغیری برای ذخیره اطلاعات کاربر فعلی

  /**
   * @method ngOnInit
   * @description وقتی صفحه لود می‌شود، اطلاعات کاربر را از اطلاعات "پدرِ" این مسیر دریافت می‌کند.
   */
  ngOnInit(): void {
    this.user = this.route.parent?.snapshot.data['user'];
  }

  /**
   * @method submit
   * @description این تابع وقتی کاربر دکمه ثبت تغییرات رمز عبور را می‌زند اجرا می‌شود.
   */
  submit() {
    if (this.editForm.valid) {
      // اگر فرم معتبر بود، اطلاعات را به سرور بفرست
      this.userService.changePassword(this.editForm.value).subscribe((res) => {
        // پس از تغییر رمز، توکن جدید (کلید ورود) را ذخیره کن
        this.authService.setNewToken(res.token);
      });
    } else {
      // اگر خطایی در فرم بود، فیلدها را قرمز کن تا کاربر متوجه شود
      this.editForm.markAllAsTouched();
    }
  }

  /**
   * @method matchPasswords
   * @description یک تابع اعتبارسنجی سفارشی که بررسی می‌کند آیا "رمز عبور جدید" با "تکرار آن" برابر است یا خیر.
   * @param group کنترل‌های فرم
   * @returns اگر برابر نباشند یک خطا (notMatching) برمی‌گرداند، در غیر این صورت مقدار null (بدون خطا).
   */
  matchPasswords(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('passwordConfirm')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  /**
   * @description یک راه میان‌بر برای دسترسی راحت‌تر به اجزای فرم در فایل HTML.
   */
  get f() {
    return this.editForm.controls;
  }

  showDialog() {
    this.open = true;
  } // نمایش پنجره انتخاب عکس

  closeDialog() {
    this.open = false;
    this.removeFile(); // پاک کردن فایل انتخاب شده هنگام بستن پنجره
  }

  // تعریف کنترلر برای مدیریت فایل انتخاب شده
  protected readonly control = new FormControl<TuiFileLike | null>(null, Validators.required);

  // Subjectها مانند فرستنده‌های پیام هستند که وضعیت فایل را (لودینگ، خطا یا موفقیت) گزارش می‌دهند
  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();

  // وقتی کاربر فایلی انتخاب می‌کند، این بخش به صورت خودکار عملیات پردازش را شروع می‌کند
  protected readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => this.processFile(file)),
  );

  protected removeFile(): void {
    this.control.setValue(null);
  }

  /**
   * @method processFile
   * @description بررسی اولیه فایل انتخابی برای اطمینان از صحت آن.
   */
  protected processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);
    if (this.control.invalid || !file) {
      return of(null);
    }
    return of(file);
  }

  /**
   * @method onImgSubmit
   * @description وظیفه اصلی ارسال عکس به سرور را بر عهده دارد.
   * @param observer یک شیء برای مدیریت وضعیت اتمام عملیات (بستن خودکار دیالوگ)
   */
  onImgSubmit(observer: any): void {
    const rawFile = this.control.value;
    if (!rawFile) return;

    const file = rawFile as File;
    const formData = new FormData(); // ایجاد یک ظرف (پاکت نامه دیجیتال) برای ارسال فایل

    // اضافه کردن فایل به ظرف با کلید 'image' که سرور منتظر آن است
    formData.append('image', file);

    // نمایش وضعیت در حال بارگذاری (چرخنده) روی فایل
    this.loadingFiles$.next(rawFile);

    this.http
      .patch(`${this.apiUrl}/users/updateMe`, formData) // ارسال درخواست به سرور برای آپلود عکس
      .pipe(
        finalize(() => {
          // این بخش در هر صورت (چه موفقیت چه خطا) اجرا می‌شود تا حالت لودینگ متوقف شود
          this.loadingFiles$.next(null);
          // دریافت مجدد اطلاعات کاربر از سرور برای بروزرسانی عکس در صفحه
          this.userService.getUser().subscribe((res) => {
            this.user = res;
          });
        }),
      )
      .subscribe({
        next: (res) => {
          console.log('آپلود موفقیت‌آمیز بود');
          observer.complete(); // بستن پنجره دیالوگ
          this.control.setValue(null); // خالی کردن فیلد انتخاب فایل
        },
        error: (err) => {
          console.error(err);
          this.failedFiles$.next(rawFile); // نمایش وضعیت قرمز (خطا) روی فایل
        },
      });
  }

  /**
   * @method createImagePath
   * @description تبدیل نام عکس (که از سرور می‌آید) به یک آدرس کامل قابل نمایش در تگ img.
   */
  createImagePath(imageName: string) {
    return `${this.baseURL}/images/${imageName}`;
  }
}
