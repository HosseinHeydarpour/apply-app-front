import { TuiRoot } from '@taiga-ui/core';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { Agency } from './core/services/agency';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('apply-app');
  protected readonly agencyService = inject(Agency);

  ngOnInit(): void {}
}
