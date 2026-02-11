import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { UserService } from '../../../../core/services/user-service';
import { Empty } from '../../../../shared/components/empty/empty';
import { JalaliPipe } from '../../../../shared/pipes/jalali-pipe';

@Component({
  selector: 'app-history',
  imports: [TuiIcon, RouterLink, Empty, JalaliPipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  host: {
    class: 'p-4 ps-5 pl-5  block',
  },
})
export class History implements OnInit {
  userService = inject(UserService);
  history: any[] = [];
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    // The data is already here! No loading spinner needed.
    this.history = this.route.snapshot.data['history'];
  }
}
