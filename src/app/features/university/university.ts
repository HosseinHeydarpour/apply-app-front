import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-university',
  imports: [NgFor, TuiButton, TuiCarousel, TuiPagination],
  templateUrl: './university.html',
  styleUrl: './university.scss',
})
export class University {
  protected index = 2;
  protected readonly items = [
    {
      name: 'item 1',
      image: '/images/uni.png',
    },
    {
      name: 'item 1',
      image: '/images/uni.png',
    },
    {
      name: 'item 1',
      image: '/images/uni.png',
    },
  ];
}
