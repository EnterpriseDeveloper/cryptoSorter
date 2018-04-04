import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database-deprecated";
import { AngularFireAuth} from 'angularfire2/auth';
import { Wallet } from './Wallet';
import { AuthService } from './auth.service';


@Injectable()
export class WalletService {

  walletColections: FirebaseListObservable<Wallet[]> = null;
  walletColection: FirebaseObjectObservable<Wallet> = null;

  userId: string;

  constructor(private afs: AngularFireDatabase,
  private authService: AuthService) {
    this.proba()
    this.authService.user.subscribe(user =>{
      if(user) this.userId = user.uid
    });
   }

   getListWallet(): FirebaseListObservable<Wallet[]>{ 
     if(!this.userId) return;
     this.walletColections = this.afs.list(`wallet/${this.userId}`);
     return this.walletColections;
   };

key = '';
proba(){
  var query : any = this.afs.database.ref('/users').orderByChild('email').equalTo('voroshilovmax90@gmail.com')
  query.once( 'value', data => {
    data.forEach(userSnapshot => {
        let user = userSnapshot.val();
        this.key = userSnapshot.key;
    });
    if(this.key == ''){
      console.log("underdasf")
    }else{
      console.log(this.key)
    }
  });

}


   createWallet(walletColection: Wallet){
    this.walletColections.push(walletColection);
   };

   updateCoin(key, value){
    this.walletColections.update(key, value);
   };

   deleteCoin(key: string){
    this.walletColections.remove(key);
   };


}
