import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../../aservices/auth.service';

@Injectable()
export class IsEmptyWalletService {

  data: boolean = true;
  constructor(
    private auth: AuthService
  ) { 
    this.auth.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.data = false;
        }else{
          this.data = true;
        }
      })
   }

  private isEmpty = new BehaviorSubject<boolean>(this.data);
  isEmptyValue = this.isEmpty.asObservable();

  changePosition(status: boolean) {
    this.isEmpty.next(status);
  }

}
