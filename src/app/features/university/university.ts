import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiAlertService, TuiButton } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { environment } from '../../../environments/environment.development';
import { Auth } from '../../core/services/auth';
import { UniversityService } from '../../core/services/university-service';

@Component({
  selector: 'app-university',
  imports: [NgFor, TuiButton, TuiCarousel, TuiPagination, RouterLink],
  templateUrl: './university.html',
  styleUrl: './university.scss',
})
export class University implements OnInit {
  protected index = 0;
  route = inject(ActivatedRoute);
  university: any;
  baseURL = environment.baseUrl;
  authService = inject(Auth);
  universityService = inject(UniversityService);

  // 2. Inject the Alert Service
  private readonly alerts = inject(TuiAlertService);

  ngOnInit(): void {
    this.university = this.route.snapshot.data['university'];
    console.log(this.university);
  }

  createImagePath(imageName: string) {
    return `${this.baseURL}/images/${imageName}`;
  }

  requestAdmission() {
    this.universityService.requestAdmission(this.university._id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.alerts
          .open('درخواست مشاوره با موفقیت ارسال شد.', {
            label: 'موفقیت',
            appearance: 'positive',
            autoClose: 5000,
          })
          .subscribe();
      },
      error: (err: any) => {
        console.log(err);
        this.alerts
          .open('درخواست مشاوره با موفقیت ارسال شد.', {
            label: 'خطا',
            appearance: 'negative',
            autoClose: 5000,
          })
          .subscribe();
      },
    });
  }
}
