
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database-deprecated";

@Injectable()
export class SharedLinkService {

  private basePath: any;

  constructor(private db: AngularFireDatabase) { }

  addShare(uniqId , data) {
  this.basePath = this.db.database.ref('/accessShared/'+ uniqId + '/');
  this.basePath.set(data);
  };

 getShareLink(idLink){
 return this.db.object('/accessShared/'+ idLink + '/');
 };

 updateShareLink(uniqId, value){
  let updateLink = this.db.database.ref('/accessShared/'+ uniqId + '/');
  updateLink.set(value);
 }

 deleteSharedLink(path){
   let deleteLink = this.db.database.ref('/accessShared/'+ path + '/');
   return deleteLink.remove();
 }


}
