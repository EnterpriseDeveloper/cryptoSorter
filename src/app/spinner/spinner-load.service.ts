import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerLoadService {

  private loading = new BehaviorSubject<boolean>(true);
  currentStatus = this.loading.asObservable();

  constructor() { }

  changeMessage(status: boolean) {
    this.loading.next(status)
  }

}
