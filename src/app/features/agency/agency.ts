import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-agency',
  imports: [NgFor, TuiButton, TuiCarousel, TuiPagination],
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
})
export class Agency {
  protected index = 2;
  protected readonly items = [
    {
      name: 'item 1',
      image: '/images/agency1.png',
    },
    {
      name: 'item 1',
      image: '/images/agency1.png',
    },
    {
      name: 'item 1',
      image: '/images/agency1.png',
    },
  ];
}
