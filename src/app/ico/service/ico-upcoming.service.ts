
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class IcoUpcomingService {

  private _postsURL =  "https://cors-anywhere.herokuapp.com/https://chasing-coins.com/api/v1/icos/upcoming";
  
  constructor(private http: Http) {
   } 
  getIcoUpcoming() :Observable<any> {
      return this.http         
          .get(this._postsURL )
          .map(res =>  res.json())
          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  };
  

}