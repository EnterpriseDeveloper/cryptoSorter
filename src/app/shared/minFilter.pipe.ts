import { Pipe, PipeTransform } from '@angular/core';

import { Currency } from './currency';

@Pipe({
    name: 'minfilter', 
    pure: false
})
export class MinFilterPipe implements PipeTransform {
  transform(items: Currency[], minFilter: Currency): Currency[] {
    if (!items || !minFilter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Currency) => this.applyFilter(item, minFilter));
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Currency} currency The book to compare to the filter.
   * @param {Currency} minFilter The filter to apply.
   * @return {boolean} True if book satisfies filters, false if not.
   */
  applyFilter(currency: Currency, minFilter: Currency): boolean {
    for (let field in minFilter) {
      if (minFilter[field]) {
        if (typeof minFilter[field] === 'string') {
          if (currency[field].toLowerCase().indexOf(minFilter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof minFilter[field] === 'number') {
          if (currency[field] <= minFilter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}