import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class ChartService {


  constructor(
    private http: Http,
  ) { }
getChartData(symbol){
  let page = ' https://min-api.cryptocompare.com/data/histoday?fsym='+ symbol +'&tsym=USD&aggregate=1&limit=999999999999999999'
  return this.http         
 .get(page)
 .map(res =>  res.json())
 .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
}

}
