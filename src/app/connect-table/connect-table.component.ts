import { Component, OnDestroy} from '@angular/core';
import { AuthService } from '../aservices/auth.service';
import {MatTabsModule} from '@angular/material/tabs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../login-user/login-user.component';
import {Observable} from 'rxjs/Observable';
import {Wallet} from '../aservices/Wallet';
import {WalletService} from '../aservices/wallet.service';


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
  public currentJustify = 'center';

  constructor(
    public authService: AuthService,
    private modalService: NgbModal,
    public loginUser: LoginUserComponent,
    private walletService: WalletService,
  )  {
    this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
        } else {
          this.isLoggedIn = true;
          this.wallets = this.walletService.getListWallet();
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
          return this.walletEmpty = false;
        }else{
          return this.walletEmpty = true;
        }
   });
  }



  openRegistModal(){
    const modalRef = this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }

  ngOnDestroy(){
    this.walletSub.unsubscribe();
  }

}

