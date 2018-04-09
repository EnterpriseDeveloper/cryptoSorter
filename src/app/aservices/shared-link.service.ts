
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database-deprecated";

@Injectable()
export class SharedLinkService {

  private basePath: any;

  constructor(private db: AngularFireDatabase) { }

  addShare(uniqId , data) {
  this.basePath = this.db.database.ref('/accessShared/'+ uniqId + '/');
  this.basePath.push(data);
  }

  update() {

  }


}
