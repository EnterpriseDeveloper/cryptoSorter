 import {Injectable} from "@angular/core";
 import {Http, Response} from "@angular/http";
 import {Observable} from "rxjs/Observable";
 import "rxjs/Rx";

@Injectable()
export class ListcryptocompareService {

  private _postsURL = "https://min-api.cryptocompare.com/data/all/coinlist";

  constructor(private http: Http) {
   } 
  get() {
      return this.http         
          .get(this._postsURL)
          .map(res =>  res.json())
          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  };

}
