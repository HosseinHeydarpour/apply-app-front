import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiIcon, TuiIconPipe } from '@taiga-ui/core';
@Component({
  selector: 'app-navbar',
  imports: [TuiIcon, TuiIconPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {}
