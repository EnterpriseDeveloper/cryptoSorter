import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class IcoActiveService {

  private _postsURL =  "https://cors-anywhere.herokuapp.com/http://chasing-coins.com/api/v1/icos/active";
  
  constructor(private http: Http) {
   } 
  getIcoActive() :Observable<any> {
      return this.http         
          .get(this._postsURL )
          .map(res =>  res.json())
          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  };
  

}
