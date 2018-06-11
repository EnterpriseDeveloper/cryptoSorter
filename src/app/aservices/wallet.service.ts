import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database-deprecated";
import { AngularFireAuth} from 'angularfire2/auth';
import { Wallet } from './Wallet';
import { AuthService } from './auth.service';
import { ListWalletService } from '../wallet/service/list-wallet.service';
import { ListOfWallet} from '../wallet/service/ListOfWallet';


@Injectable()
export class WalletService {

  walletColections: FirebaseListObservable<Wallet[]> = null;

  userId: string;

  constructor(private afs: AngularFireDatabase,
              private authService: AuthService,
              private listWalletService: ListWalletService) {
    this.authService.user.subscribe(user =>{
      if(user) this.userId = user.uid
    });
   } 


   getListWallet(idUser, path){ 
     this.walletColections = this.afs.list('wallet/' + idUser + '/' + path + '/' + 'coin');
     return this.walletColections;
   };

   description: any;
   createWalletDescription(path, data){
     this.description = this.afs.list('wallet/' + this.userId + '/' + path + '/adescription');
     this.description.set('description', data)
   };
   
   getDescription(idUser, path){
    return this.afs.list('wallet/' + idUser + '/' + path + '/adescription');
   }

   updateDescription(path, data){
     let paths = this.afs.list('wallet/' + this.userId + '/' + path);
     paths.update('adescription' ,data)
   }

   getListWalletFull(idUser) { 
    return this.afs.list('wallet/' + idUser);
  };

   createWallet(path ,walletColection: Wallet){
    this.afs.list('wallet/' + this.userId + '/' + path + '/' + 'coin').push(walletColection);
   };

   createWalletFromCurrency(path, data){
     this.afs.list('wallet/' + this.userId + '/' + path + '/' + 'coin').push(data);
   }

   updateCoin(key, value){
    this.walletColections.update(key, value);
   };

   deleteCoin(key: string){
    this.walletColections.remove(key);
   };

   deleteFullWallet(key: string){
    let deleteWallet = this.afs.list('wallet/' + this.userId)
    return deleteWallet.remove(key);
   }


}
