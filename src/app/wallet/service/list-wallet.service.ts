import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database-deprecated";
import { AngularFireAuth} from 'angularfire2/auth';
import { ListOfWallet } from './ListOfWallet';
import { AuthService } from '../../aservices/auth.service';

@Injectable()
export class ListWalletService {

  listOfWalletColections: FirebaseListObservable<ListOfWallet[]> = null;

  userId: string;

  constructor(private afs: AngularFireDatabase, 
    private authService: AuthService) {
     this.authService.user.subscribe(user => {
      if(user) this.userId = user.uid 
     });
}



   getListWallet() {
     if (!this.userId) return;
     this.listOfWalletColections = this.afs.list(`listOfWalletColections/${this.userId}`);
     return this.listOfWalletColections;
   }

   addListWallet(data){
    this.afs.list(`listOfWalletColections/${this.userId}`).push(data);
   };

   updateListWallet(key, data){
    this.listOfWalletColections.update(key, data);
   }


   deleteWallet(key: string){
    this.listOfWalletColections.remove(key);
   };

   shareListWallet(userID, pathOfShare, data){
    let path = this.afs.database.ref('listOfWalletColections/' + userID).child(pathOfShare)
    path.set(data);
   }

   deleteShareListWallet(userID, pathOfShare){
    let path = this.afs.database.ref('listOfWalletColections/' + userID).child(pathOfShare)
    path.remove();
   }

   updateShareListWallet(userID, pathOfShare, data){
    let path = this.afs.database.ref('listOfWalletColections/' + userID).child(pathOfShare)
    path.update({percent: data});
   }

}
