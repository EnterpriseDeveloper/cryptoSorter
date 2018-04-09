import { Component, OnDestroy} from '@angular/core';
import { AuthService } from '../aservices/auth.service';
import {Observable} from 'rxjs/Observable';
import {Wallet} from '../aservices/Wallet';
import {WalletService} from '../aservices/wallet.service';
import {Router} from '@angular/router';

@Component({
  selector: 'connectTable',
  templateUrl: './connect-table.component.html',
  styleUrls: ['./connect-table.component.css'],
  providers: [WalletService]
})
export class ConnectTableComponent implements OnDestroy {

  public isLoggedIn: boolean;
  public currentOrientation = 'horizontal';
  private wallets: Observable<Wallet[]>;
  private walletSub: any;
  private walletData: any = [];
  private walletValue: any = [];
  public walletEmpty: boolean = true;
  public showMenu: boolean = false;

  constructor(
    public authService: AuthService,
    private walletService: WalletService,
    public route: Router,
  )  {
    this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
        } else {
          this.isLoggedIn = true;
          let userId = auth.uid
          this.wallets = this.walletService.getListWallet(userId);
          this.getWalletList();
        }
      });
      if (window.matchMedia('screen and (max-width: 700px)').matches) {
        this.currentOrientation = 'vertical';
      }
  }


  getWalletList(){
   this.walletSub = this.wallets.subscribe((walletData)=>{
        this.walletData = walletData;
        this.walletValue = [];
        this.walletData.forEach(walletData => {
          return this.walletValue.push(walletData.id);
        });
        if(this.walletData.length > 0 ){
          this.route.navigate(['/portfolio']);
          return this.walletEmpty = false;
        }else{
          this.route.navigate(['']);
          return this.walletEmpty = true;
        }
   });
  }

  toggle() { this.showMenu = !this.showMenu; }


  ngOnDestroy(){
    this.walletSub.unsubscribe();
  }

}

