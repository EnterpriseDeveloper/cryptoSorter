import { Component, OnDestroy, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { AuthService } from '../aservices/auth.service';
import {Observable} from 'rxjs/Observable';
import {Wallet} from '../aservices/Wallet';
import {WalletService} from '../aservices/wallet.service';
import {Router, RouterLink ,ActivatedRoute} from '@angular/router';
import {ListWalletService} from '../wallet/service/list-wallet.service';
import {WalletComponent} from '../wallet/wallet.component';


@Component({
  selector: 'connectTable',
  templateUrl: './connect-table.component.html',
  styleUrls: ['./connect-table.component.css'],
  providers: [WalletService]
})
export class ConnectTableComponent implements OnDestroy {

  public isLoggedIn: boolean;
  private wallets: Observable<Wallet[]>;
  private walletSub: any;
  private walletData: any = [];
  private walletValue: any = [];
  public walletEmpty: boolean = true;
  public userSub: any;
  public listSub: any;
  public listWallet: any;


  constructor(
    public authService: AuthService,
    private walletService: WalletService,
    public route: Router,
    private activityRouter: ActivatedRoute,
    private listWalletService: ListWalletService,
    private walletComponent: WalletComponent,

  )  {
    this.userSub = this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
        } else {
          this.isLoggedIn = true;
         this.listSub = this.listWalletService.getListWallet().subscribe((data)=> { 
           if(data.length != 0){
            this.listWallet = data
            let path = data[0].id
            let userId = data[0].userID
            this.wallets = this.walletService.getListWallet(userId, path);
            this.getWalletList();
           }
            })
        }
      });

  }






  getWalletList(){
   this.walletSub = this.wallets.subscribe((walletData)=>{
        this.walletData = walletData;
        this.walletValue = [];
        this.walletData.forEach(walletData => {
          return this.walletValue.push(walletData.id);
        });
        if(this.walletData.length > 0 ){
          this.walletComponent.getWalletList();    
          return this.walletEmpty = false;
        }else if(this.listWallet.length >= 2){
          this.walletComponent.getWalletList();    
          return this.walletEmpty = false;
        }else{
          return this.walletEmpty = true;
        }
   });
  }




  ngOnDestroy(){
    if(this.isLoggedIn === true){
      this.listSub.unsubscribe();
    //  this.walletSub.unsubscribe();
    }
  }

}

