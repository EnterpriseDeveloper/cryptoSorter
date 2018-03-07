import {Injectable} from "@angular/core";
 import {Http, Response} from "@angular/http";
 import {Observable} from "rxjs/Observable";
 import "rxjs/Rx";
 import {IPosts} from "./IPosts";

 
 @Injectable()
 export class ApiService {
 
     private _postsURL = "https://api.coinmarketcap.com/v1/ticker/?limit=0";
     public dataApi: IPosts;

     constructor(private http: Http) {
      } 
     get() {
         return this.http         
             .get(this._postsURL)
             .map(res =>  res.json())
             .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     };

 }