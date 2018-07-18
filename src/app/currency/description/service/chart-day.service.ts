
import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class ChartDayService {


  constructor(
    private http: Http,
  ) { }
getChartData(day, symbol, time){
  let page = 'https://min-api.cryptocompare.com/data/'+day+'?fsym='+symbol+'&tsym=USD&aggregate=1&limit=999999999999999999&toTs='+ time
  return this.http         
 .get(page)
 .map(res =>  res.json())
 .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
}

}
