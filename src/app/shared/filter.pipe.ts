import { Pipe, PipeTransform } from '@angular/core';

import { Currency } from './currency';

@Pipe({
    name: 'currencyfilter',
    pure: false
})
export class CurrencyFilterPipe implements PipeTransform {
  transform(items: Currency[], filter: Currency): Currency[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Currency) => this.applyFilter(item, filter));
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Currency} currency The book to compare to the filter.
   * @param {Currency} filter The filter to apply.
   * @return {boolean} True if book satisfies filters, false if not.
   */
  applyFilter(currency: Currency, filter: Currency): boolean {
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (currency[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (currency[field] > filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}