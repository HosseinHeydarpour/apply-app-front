import { TuiRoot } from '@taiga-ui/core';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('apply-app');
}
