import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { UserService } from '../../../../core/services/user-service';
import { Empty } from '../../../../shared/components/empty/empty';
import { JalaliPipe } from '../../../../shared/pipes/jalali-pipe';

/**
 * @class History
 * @description این کلاس (Component) مسئول نمایش صفحه "تاریخچه" است.
 * وظیفه اصلی آن، دریافت اطلاعات از قبل بارگذاری شده و نمایش آن‌ها در قالب یک لیست به کاربر می‌باشد.
 */
@Component({
  selector: 'app-history', // نام اختصاصی این کامپوننت برای استفاده در فایل‌های دیگر
  imports: [TuiIcon, RouterLink, Empty, JalaliPipe], // ابزارهای جانبی که در این صفحه استفاده شده‌اند (مثل آیکون‌ها و مبدل تاریخ شمسی)
  templateUrl: './history.html', // آدرس فایل ظاهر صفحه (HTML)
  styleUrl: './history.scss', // آدرس فایل استایل‌دهی و رنگ‌بندی (CSS)
  host: {
    class: 'p-4 ps-5 pl-5  block', // کلاس‌های ظاهری برای ایجاد فاصله و چیدمان مناسب صفحه
  },
})
export class History implements OnInit {
  /**
   * @property userService
   * @description تزریق سرویس مدیریت کاربران.
   * از inject برای دسترسی به امکاناتی که در فایل UserService تعریف شده استفاده می‌کنیم.
   */
  userService = inject(UserService);

  /**
   * @property history
   * @description یک متغیر از نوع آرایه (لیست) که اطلاعات تاریخچه را در خود نگه می‌دارد تا در خروجی نمایش دهیم.
   */
  history: any[] = [];

  /**
   * @property route
   * @description این ابزار به ما کمک می‌کند تا به اطلاعاتی که از طریق "آدرس مرورگر" منتقل می‌شوند دسترسی پیدا کنیم.
   */
  route = inject(ActivatedRoute);

  /**
   * @method ngOnInit
   * @description این یک "چرخه حیات" (Lifecycle Hook) است.
   * یعنی تابعی است که به محض اینکه صفحه برای کاربر باز (لود) می‌شود، به صورت خودکار اجرا می‌گردد.
   * @returns {void} این تابع مقداری را برنمی‌گرداند.
   */
  ngOnInit(): void {
    /**
     * توضیح برای دانشجو:
     * در برنامه‌نویسی حرفه‌ای، گاهی قبل از اینکه صفحه باز شود، داده‌ها را آماده می‌کنیم (توسط Resolver).
     * به همین دلیل در این خط، ما داده‌ها را از "snapshot" یا همان تصویرِ لحظه‌ایِ آدرسِ جاری می‌گیریم.
     * چون داده‌ها از قبل آماده هستند، دیگر نیازی به نمایش علامت در حال چرخش (Loading) نیست.
     */
    this.history = this.route.snapshot.data['history'];
  }
}
