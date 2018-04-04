import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'currencyValueChange'})
export class CurrencyValueChange implements PipeTransform {
  transform(num: number) {

    // Nine Zeroes for Billions
    return Math.abs(Number(num)) >= 1.0e+9
    ? (Math.abs(Number(num)) / 1.0e+9 ).toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2}) + " B"
    : Math.abs(Number(num)) >= 1.0e+8
        ? (Math.abs(Number(num)) / 1.0e+6 ).toLocaleString('en-US', {maximumFractionDigits:1, minimumFractionDigits:1}) + " M"
        // Six Zeroes for Millions
        : Math.abs(Number(num)) >= 1.0e+6
            ? (Math.abs(Number(num)) / 1.0e+6 ).toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2}) + " M"
            // Three Zeroes for Thousands
            : Math.abs(Number(num)) >= 1.0e+5
                ? (Math.abs(Number(num)) / 1.0e+3 ).toLocaleString('en-US', {maximumFractionDigits:1, minimumFractionDigits:1}) + " K"
                // For one number after floating point
                : Math.abs(Number(num)) >= 1.0e+2
                ? (Math.abs(Number(num))).toLocaleString('en-US', {maximumFractionDigits:0, minimumFractionDigits:0})
                                // For two number after floating point
                                : Math.abs(Number(num)) >= 10
                                ? (Math.abs(Number(num))).toLocaleString('en-US', {maximumFractionDigits:1, minimumFractionDigits:1})
                                      // For six number after floating point
                                      : Math.abs(Number(num)) >= 1
                                      ? (Math.abs(Number(num))).toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})
                                              : Math.abs(Number(num)) >= 0
                                              ? (Math.abs(Number(num))).toLocaleString('en-US', {maximumFractionDigits:6, minimumFractionDigits:6})
                                              : Math.abs(Number(num)); 
  }
}