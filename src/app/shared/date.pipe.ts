import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'datePipes'})
export class DatePipes implements PipeTransform {
  transform(dates: Date) {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
   let date = require('date-and-time');

    let str = dates;
    let d = date.parse(str, 'YYYY-MM-DD HH:mm:ss'); 
    let myDate: any = new Date();
    let dateIco: any = new Date(d)
    let days = (myDate - dateIco)/(1000*60*60*24)
    return Math.abs(days).toFixed(0) + ' days ( ' + monthNames[dateIco.getMonth()] + ' ' + dateIco.getDate() + ', ' + dateIco.getFullYear() + ' )';
 
  }
}