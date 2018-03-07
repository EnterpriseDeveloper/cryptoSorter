import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../aservices/auth.service';
import { WalletService } from '../aservices/wallet.service';
import { ApiService} from '../aservices/api-service.service';
import * as _ from "lodash";
import { Wallet } from '../aservices/Wallet';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnDestroy {
 
  public walletValue: any = [];
   public walletSub: any;
   public walletData: any;
   public wallets: Observable<Wallet[]>;
   public apiSub: any;
   public dataTables: any;
   public filterWallet: any;
   public connection: any;
   public summ: any = [];
   public persent: any = [];
   public totalSum: any = 0;
   public persentTotal: any = 0;
   public loading: boolean = false;
   private userSub:any;
   private persentUSD: any = 0;
   private isEmptyValue: boolean = true;

  constructor(private apiService: ApiService,
    public auth: AuthService,
    public walletService: WalletService,
) {
  this.loading = true;
   this.userSub = this.auth.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.walletValue = [];
        } else {
          this.wallets = this.walletService.getListWallet();
          this.getWalletList();
        }
      }
    );
  } 

  getWalletList(){
  this.walletSub = this.wallets.subscribe((walletData)=>{
    this.walletData = walletData;
    this.walletValue = [];
      this.walletData.forEach(walletData =>{
      return this.walletValue.push(walletData.id);
    })
    this.apiSub = this.apiService.get()  
    .subscribe((dataItem) => {
      this.dataTables = dataItem;   
     this.filterWallet =  this.dataTables.filter((i) => {
        return this.walletValue.indexOf(i.id) != -1;
     });  

     this.connection = _.map(this.filterWallet, (item) => {
      return _.assign(item, _.find(this.walletData, ['id', item["id"] ]));
    });
    this.isEmpty();
    this.isEmptyCheck();
   });
  })
  }

  isEmpty(){
    if (this.walletValue.length > 0) {
    return false
    } else {
     return true;
    };
  }


  isEmptyCheck(){
    if (this.walletValue.length > 0) {
      this.formula()
    return this.isEmptyValue = false
    } else {
     this.loading = false;
     this.isEmptyValue = true;
     return true;
    };
  }

 
formula(){
  this.connection.forEach(connection=>{
    var total;
    var total24_h;
    var that = this;
     function getTotalValue(connection){

      total = connection.price_usd * connection.coins;

      return (total)
     };

     function getTotal24_hValue(connection){

      total24_h = total * connection.percent_change_24h;

      return (total24_h);
     };

     var tableBodyHtml = this.connection.map(function(connection) {
      return Object.assign(connection, {total: getTotalValue(connection)}, {total24_h: getTotal24_hValue(connection)});
      })
     
  });

  this.getSumma();
};



  getSumma(){
    this.summ = [];
    this.connection.forEach(connect =>{
      return this.summ.push(connect.total);
  });  

 let total = _.sum(this.summ);

     this.totalSum = total.toFixed(0);
     this.loading = false;

     this.getPersantChange(total);
  }

  getPersantChange(total){
    this.persent = [];
    this.connection.forEach(persent =>{
      return this.persent.push(persent.total24_h)
    })

    let persentSum = _.sum(this.persent);

    let per = persentSum/total;
    this.persentTotal = per.toFixed(2);
    let perUSD = (this.persentTotal*total)/100;
    this.persentUSD = perUSD.toFixed(2);
  }

  ngOnDestroy(){
this.userSub.unsubscribe();
  }


}