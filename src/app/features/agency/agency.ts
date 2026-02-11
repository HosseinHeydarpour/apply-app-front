import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TuiButton, TuiAlertService } from '@taiga-ui/core'; // 1. Import TuiAlertService
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { AgencyService } from '../../core/services/agency-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-agency',
  standalone: true,
  imports: [NgFor, TuiButton, TuiCarousel, TuiPagination, RouterLink],
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
})
export class Agency implements OnInit {
  protected index = 0;

  protected route = inject(ActivatedRoute);
  protected agencyService = inject(AgencyService);

  // 2. Inject the Alert Service
  private readonly alerts = inject(TuiAlertService);

  agency: any;
  baseURL = environment.baseUrl;
  authService = inject(Auth);
  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.agency = this.route.snapshot.data['agency'];
  }

  createImagePath(imageName: string) {
    return `${this.baseURL}/images/${imageName}`;
  }

  requestConsultation() {
    this.agencyService.requestConsultation(this.agency._id).subscribe({
      next: (res) => {
        // 3. Show Success Toast
        this.alerts
          .open('درخواست مشاوره با موفقیت ارسال شد.', {
            label: 'موفقیت',
            appearance: 'positive',
            autoClose: 3000,
          })
          .subscribe(); // <--- Important:  must subscribe to the alert!
        // wait 3s and navigate back
        setTimeout(() => {
          window.history.back();
        }, 3000);
      },
      error: (error) => {
        // 4. Show Error Toast
        this.alerts
          .open('درخواست مشاوره با موفقیت ارسال شد.', {
            label: 'خطا',
            appearance: 'negative',
            autoClose: 3000,
          })
          .subscribe(); // <--- Important:  must subscribe to the alert!

        console.error(error);
      },
    });
  }
}
