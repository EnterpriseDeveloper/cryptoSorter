import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'currencyValueChange'})
export class CurrencyValueChange implements PipeTransform {
  transform(num: number) {

    // Nine Zeroes for Billions
    return Number(num) >= 1.0e+9 
    ? (Number(num) / 1.0e+9 ).toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2}) + " B"
    : Number(num) >= 1.0e+8
        ? (Number(num) / 1.0e+6 ).toLocaleString('en-US', {maximumFractionDigits:1, minimumFractionDigits:1}) + " M"
        // Six Zeroes for Millions
        : Number(num) >= 1.0e+6
            ? (Number(num) / 1.0e+6 ).toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2}) + " M"
            // Three Zeroes for Thousands
            : Number(num) >= 1.0e+5
                ? (Number(num) / 1.0e+3 ).toLocaleString('en-US', {maximumFractionDigits:1, minimumFractionDigits:1}) + " K"
                // For one number after floating point
                : Number(num) >= 1.0e+2
                ? (Number(num)).toLocaleString('en-US', {maximumFractionDigits:0, minimumFractionDigits:0})
                                // For two number after floating point
                                : Number(num) >= 10
                                ? (Number(num)).toLocaleString('en-US', {maximumFractionDigits:1, minimumFractionDigits:1})
                                      // For six number after floating point
                                      : Number(num) >= 1
                                      ? (Number(num)).toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})
                                              : Number(num) >= 0
                                              ? (Number(num)).toLocaleString('en-US', {maximumFractionDigits:6, minimumFractionDigits:6})
                                              : Number(num) <= 0
                                                 ? (Number(num)).toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})
                                                 : Number(num); 
  }
}