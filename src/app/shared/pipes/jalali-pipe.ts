import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jalali',
})
export class JalaliPipe implements PipeTransform {
  transform(value: any, includeTime: boolean = false): string {
    if (!value) return '';

    const date = new Date(value);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      calendar: 'persian',
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return new Intl.DateTimeFormat('fa-IR', options).format(date);
  }
}
