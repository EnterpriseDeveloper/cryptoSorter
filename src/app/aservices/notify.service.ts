import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

/// Notify users about errors and other helpful stuff
export interface Msg {
  content: string;
  style: string;
}

@Injectable()
export class NotifyService {

  private _msgSource = new Subject<Msg | null>();
  public style: string;

  msg = this._msgSource.asObservable();

  update(content: string, style: 'error' | 'info' | 'success') {
    const msg: Msg = { content, style };
    this.style = style
    this._msgSource.next(msg);
    var self = this;
    setTimeout(function(){
      self.clear();
    }, 6000);

  }
 
  clear() {
    this._msgSource.next(null);
  }
}