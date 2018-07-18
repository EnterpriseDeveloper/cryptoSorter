import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database-deprecated";


 
 @Injectable()
 export class ApiService {
 
     constructor(private afd: AngularFireDatabase) {
      } 

     getApi() {
         return this.afd.list('currency/list/items');
     };

 }