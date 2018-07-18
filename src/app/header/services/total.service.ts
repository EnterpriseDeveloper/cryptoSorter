import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TotalService {

  private total = new BehaviorSubject<any>('empty');
  totalSum = this.total.asObservable();

  private persent = new BehaviorSubject<any>('empty');
  persentSum = this.persent.asObservable();

  private totalM = new BehaviorSubject<any>('empty');
  totalModule = this.totalM.asObservable();

  constructor() { }

  changeTotal(status: any) {
    this.total.next(status);
  }

  changePersent(persent: any) {
    this.persent.next(persent);
  }

  changeTotalM(totalMod: any) {
    this.totalM.next(totalMod);
  }


}
