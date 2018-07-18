import {Component, Inject, enableProdMode, OnDestroy} from '@angular/core';
import {ListWalletService} from './wallet/service/list-wallet.service';
import {ListOfWallet} from './wallet/service/ListOfWallet';
import {SharedLinkService} from './aservices/shared-link.service';
import {SharedLinkData} from './aservices/sharedLInkData';
import {AuthService} from './aservices/auth.service'; 
import { WalletService } from './aservices/wallet.service';
import { DOCUMENT } from "@angular/platform-browser";

enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  private userId;
  private listSubscribe;
  private userSub;
  private userEmail;
  private path;
  toggleTheme
  constructor(
    private listWalletService: ListWalletService,
    private authService: AuthService,
    private sharedService: SharedLinkService,
    private walletService: WalletService,
    @Inject(DOCUMENT) private document
  ){
    let toggleTheme = localStorage.getItem("toggleMenu");
              this.toggleTheme = JSON.parse(toggleTheme);
              if(this.toggleTheme === null){
                this.toggleTheme = false;
              }

    if(this.toggleTheme === true){
      this.document.getElementById('theme').setAttribute('href','assets/day.css');
    }else{
      this.document.getElementById('theme').setAttribute('href','assets/night.css');
    }
    
   this.userSub = this.authService.user.subscribe(user =>{
      if(user != null){
        
        this.userId = user.uid;
        this.userEmail = user.email;
       this.listSubscribe = this.listWalletService.getListWallet().subscribe((data)=>{
          let list = data
          if(list.length == 0){
          let promise = new Promise((resolve, reject) => {
            this.path = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9) ;
            var dataList: ListOfWallet = new ListOfWallet
             dataList.name = "Default";
             dataList.userID = this.userId;
             dataList.edit = true;
             dataList.id = this.path;
             dataList.percent = 100;
            this.listWalletService.addListWallet(dataList);
            resolve(this.path);
          })
          promise.then(()=>{
            this.createWalletDescription();
            this.writeLink();
          })
          }
        })
      }
    });
  }

  createWalletDescription(){
    this.walletService.createWalletDescription(this.path, 'Click to change portfolio description.')
  }


  writeLink(){
    let data: SharedLinkData = new SharedLinkData
    data.path = this.path;
    data.uid = 'closed';
    this.sharedService.addShare(this.path, data);
  }

  ngOnDestroy(){
    if(this.userId != null){
      this.listSubscribe.unsubscribe();
      this.userSub.unsubscribe();
    }
    
  }



}
