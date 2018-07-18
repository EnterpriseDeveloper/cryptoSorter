
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable} from "angularfire2/database-deprecated";
import { AngularFireAuth} from 'angularfire2/auth';
import { ICO } from './ICO';
import { AuthService } from '../../aservices/auth.service';


@Injectable()
export class IcoDbService {

  icoCollection: FirebaseListObservable<ICO[]> = null ;
  userId : string;

  constructor(private afs: AngularFireDatabase, 
              private authService: AuthService) {
       this.authService.user.subscribe(user => {
                if(user) this.userId = user.uid 
               });
}

   getListIcoLikes(): FirebaseListObservable<ICO[]>  {
    if (!this.userId) return;
    this.icoCollection = this.afs.list(`icoLikes/${this.userId}`);
    return this.icoCollection;
  }


  createIcoLikes(ico: ICO){
     this.icoCollection.push(ico);
  }

  deleteIcoLikes(key:string){
      this.icoCollection.remove(key);
  }

}
