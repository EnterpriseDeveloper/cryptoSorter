import { Component, ElementRef, ViewEncapsulation, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators,} from '@angular/forms';
import { Subject } from 'rxjs/Subject'

import { ApiService} from '../aservices/api-service.service';
import { AuthService } from '../aservices/auth.service';
import { WalletService } from '../aservices/wallet.service';
import { IPosts} from '../aservices/IPosts'; 
import { Wallet } from '../aservices/Wallet';
import * as _ from "lodash";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Coins } from './coins';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import { HeaderComponent} from '../header/header.component';
import {LoginUserComponent} from '../login-user/login-user.component';
import { ListcryptocompareService} from '../aservices/listcryptocompare.service';
import { SharedLinkService } from '../aservices/shared-link.service';
import { ActivatedRoute  } from '@angular/router';
import { AngularFireDatabase } from "angularfire2/database-deprecated";

type UserFields = 'coinValue'| 'addValueCoin';

type FormErrors = { [u in UserFields]: string };


@Component({
  selector: 'wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [ApiService, HeaderComponent],
  encapsulation: ViewEncapsulation.None
})
export class WalletComponent implements OnInit, OnDestroy {

  @ViewChild('autofocus') autofocus;
  @ViewChild('autofocusWallets') autofocusWallet: ElementRef;

  public isLoggedIn:boolean;
  public isEmptyValue: boolean = true;
  public walletValue: any = [];
  public apiSub: any;
  public userSub: any;
  public dataTables: any;
  public walletSub: any;
  public walletData: any;
  public filterWallet: any;
  public connection: any;
  public tabCoin: any;
  public modalCoin: any;
  public coin: any;
  public index: any;
  public summ: any =[];
  public totalSum: any;
  public deleteTab: any;
  public deleteCurrency: any;
  private items:Array<any> = [];
  public ngxDisabled = false;
  public addModal:any;
  public currencyAdd: any = [{name:'name', price_usd:'price'}];
  public chosenCur: boolean = false;
  public filterCur: any;
  public coins = '';
  public addCoins = '';
  private newArray: any;
  private sum = 0;
  private buildSub:any;
  private updateForm: any;
  private addSub: any;
  private wallet : Wallet = new Wallet;
  private coinAmount;
  private addCoinModule:any;
  public isEmptyWallet: any;
  public walletsCoin: any =[];
  public filter:any;
  public selectedRow:number;
  public deleteIndex: any;
  public inputFocused = false;
  public loadingCoin = false;
  public listCompareSub: any;
  public listComapreItem: any;
  public userEmail: string;
  public userId: string;

 coinForm: FormGroup ;
 addForm: FormGroup

  formErrors: FormErrors = {
    'coinValue': '',
    'addValueCoin': ''
  };



  validationMessages = { 
    'coinValue': {
      'required': 'Coins is required.',
      'minlength': 'Coins must be at least 1 characters long.',
      'maxlength': 'Coins cannot be more than 30 characters long.',
      'pattern': 'Cannot contain more than 10 characters after the point',
    }
  };

  validMessages = { 
    'addValueCoin': {
      'required': 'Coins is required.',
      'minlength': 'Coins must be at least 1 characters long.',
      'maxlength': 'Coins cannot be more than 30 characters long.',
      'pattern': 'Cannot contain more than 10 characters after the point',
    }
  };


  public loading: boolean = false;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    public walletService: WalletService,
    public sharedService: SharedLinkService,
    public modalService: NgbModal,
    public fb: FormBuilder,
    public headerComponent: HeaderComponent,
    public listCompare: ListcryptocompareService,
    public http: Http,
    public activityRouter: ActivatedRoute,
    public db: AngularFireDatabase 
  ) {
    this.loading = true;  
    this.userSub = this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
          this.walletValue = [];
          this.loading = false;
          this.getIdLink();
        } else {
          this.userEmail = auth.email;
          this.userId = auth.uid;
          this.isLoggedIn = true;
          this.getWalletList(this.userId);
        //  this.pushDataShareLink(); записывать только раз.
        }
      });
   }

   ngOnInit(){
    this.buildForm();
   }

   private idLink: string;
   private linkIsempty: boolean;
   private sharedData : any;
   private userIdLink: any;
   getIdLink(){
     this.idLink = this.activityRouter.snapshot.paramMap.get('id');
     if(this.idLink == ':id'){
       this.linkIsempty = true;
       return
     }else{
       this.linkIsempty = false;
       this.loading = true;
       this.isLoggedIn = true;
         this.db.list('/accessShared/'+ this.idLink + '/')
         .subscribe((shared)=>{
           this.sharedData = shared;
           this.userId =this.sharedData[0].$value
           console.log(this.userId)
           this.getWalletList(this.userId);
         })

     }
   }


   getWalletList(idUser){ 
    let promise = new Promise((resolve, reject) =>{
 this.walletSub = this.walletService.getListWallet(idUser).subscribe((walletData)=>{
      this.walletData = walletData;
      this.walletValue = [];
      this.isEmptyWallet = this.headerComponent.isEmpty();
        this.walletData.forEach(walletData =>{
        return this.walletValue.push(walletData.id);
      })
      resolve(this.walletValue);
    })
  });

promise.then(()=>{
 this.getData();
})  

};

  getData(){
    this.listCompareSub = this.listCompare.get()
    .subscribe((listItem) => {
      this.listComapreItem = listItem;
    this.apiSub = this.apiService.get()  
    .subscribe((dataItem) => {
      this.dataTables = dataItem; 

     this.filterWallet =  this.dataTables.filter((i) => {
        return this.walletValue.indexOf(i.id) != -1;
     });  
    
    this.connection = _.map(this.filterWallet, (item) => {
      return _.assign(item, _.find(this.walletData, ['id', item['id'] ]));
  });

  this.isEmptyFind();

   let filterCur = this.dataTables.filter((i) => {
    return this.walletValue.indexOf(i.id) === -1;
 }); 

  this.items = filterCur;
   });
  })
  }



isEmptyFind(){
  if(this.walletValue.length > 0){
    this.formula()
  return this.isEmptyValue = false;
  }else{
   this.loading = false;
   this.loadingCoin = false;
   return this.isEmptyValue = true;
  };
}

formula(){

  var old = JSON.stringify(this.connection).replace(/null/g, '0'); 
  this.newArray = JSON.parse(old);

  this.newArray.forEach(connection=>{
     function getFormulaValue(connection){

      let total = connection.price_usd * connection.coins;

      return total;
     };

     var tableBodyHtml = this.newArray.map(function(connection) {
      return Object.assign(connection, {total: getFormulaValue(connection)});
      })
     
  });

 this.getSumma()
};



getSumma(){
  this.summ = [];
  this.newArray.forEach(connect =>{
    return this.summ.push(connect.total);
});  

let total = _.sum(this.summ);

   this.totalSum = total.toFixed(2);
   this.allocation();
}

allocation(){
  var that = this
  this.newArray.forEach(allocation=>{
    function getAllocationValue(allocation){

    allocation.percent_change_24h = Number(allocation.percent_change_24h);

    allocation.coins = Number(allocation.coins);

    allocation.price_usd = Number(allocation.price_usd);

     let allocations = (allocation.total*100)/that.totalSum

     return allocations;
    };

    var tableBodyHtml = this.newArray.map(function(allocation) {
     return Object.assign(allocation, {allocation: getAllocationValue(allocation)});
     })
 });

 this.walletsCoin = this.newArray;
 this.loading = false; 
 this.loadingCoin = false;

 if(this.isLoggedIn == false){
   return
 } else {
  setTimeout(()=>{
    this.autofocus.nativeElement.focus()
   },500)
 }

}

symbolNoFit(symbol){
  symbol = (symbol === "MIOTA" ? "IOT" : symbol);
  symbol = (symbol === "VERI" ? "VRM" : symbol);
  symbol = (symbol === "ETHOS" ? "BQX" : symbol);
  
  if( this.listComapreItem.Data[symbol] === undefined){
    return false
  }else{
   return true
  }
}

getCoinImage(symbol){
  symbol = (symbol === "MIOTA" ? "IOT" : symbol);
  symbol = (symbol === "VERI" ? "VRM" : symbol);
  symbol = (symbol === "ETHOS" ? "BQX" : symbol);
  
  if( this.listComapreItem.Data[symbol] === undefined){
    return "assets/icon.png";
  }else{
   return "https://www.cryptocompare.com" + this.listComapreItem.Data[symbol].ImageUrl;
  }
} 

getWebPage(symbol){

  let webPage 

  symbol = (symbol === "MIOTA" ? "IOT" : symbol);
  symbol = (symbol === "VERI" ? "VRM" : symbol);
  symbol = (symbol === "ETHOS" ? "BQX" : symbol);

  if( this.listComapreItem.Data[symbol] === undefined){
    return
  }else{
    let page = 'https://cors-anywhere.herokuapp.com/https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id='+ this.listComapreItem.Data[symbol].Id
    this.http         
   .get(page)
   .map(res =>  res.json())
   .subscribe((web)=>{
     webPage = web;
     return  window.open(webPage.Data.General.WebsiteUrl , '_blank');
   });
  }
}

  //sorting
  key: string = 'price_usd'; //set default
  reverse: boolean = true;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

openModuleAdd(addCoin){
  this.chosenCur = false;
  this.currencyAdd = '';
  this.addCoins = '';
  this.addModal = this.modalService.open(addCoin, { windowClass: 'dark-modal' });
  $('.modal-content').animate({ opacity: 1 });
  $('.modal-backdrop').animate({ opacity: 0.9 });
}

public doSelect(value: any) { 
  this.currencyAdd = this.dataTables.find(myObj => myObj.id === value);

  if(this.currencyAdd.length > 0){
  return this.chosenCur = false;
  }else{
  //  setTimeout(()=>{
  //    this.autofocusWallet.nativeElement.focus();
  //  },1000);
   return this.chosenCur = true;
  };
}



createWallet(addCoins){
  this.loadingCoin = true;
  this.wallet.id = this.currencyAdd.id;
  this.wallet.coins = addCoins;
  this.walletService.createWallet(this.wallet);
  this.addModal.close();
  this.getWalletList(this.userId);
}

getValueCoin(wallet, tabCoin){
  this.modalCoin = this.modalService.open(tabCoin, { windowClass: 'dark-modal' })
  $('.modal-content').animate({ opacity: 1 });
  $('.modal-backdrop').animate({ opacity: 0.9 });
  this.coin = this.walletsCoin.find(myObj => myObj.id === wallet.id);
  this.coinAmount = this.coin.coins;
};


  updateAmount(coin, coinAmount: number,){
    this.loadingCoin = true;
    let coins = coin.id;
    let findCoin = this.walletData.find((i)=> {
      return coins.indexOf(i.id) != -1;
    });
    this.walletService.updateCoin(findCoin.$key,{coins: coinAmount} );
    this.modalCoin.close()
    this.getWalletList(this.userId);
    }



  getDeleteCoin(wallet, deleteCoin, i){
    this.deleteTab = this.modalService.open(deleteCoin, { windowClass: 'dark-modal'}, );
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
    this.deleteCurrency = this.walletsCoin.find(myObj => myObj.id === wallet.id);
    this.index = i;
    this.deleteIndex = wallet;
  }

  deleteCoins(deleteCurrency){

    let coins = deleteCurrency.id;
    let findCoin = this.walletData.find((i)=> {
      return coins.indexOf(i.id) != -1;
    });
    this.selectedRow = this.index;
    let index = this.newArray.indexOf(this.deleteIndex);
    this.deleteTab.close();
    setTimeout(()=>{
      this.walletService.deleteCoin(findCoin.$key);
      this.walletsCoin.splice(index, 1);
      this.selectedRow = NaN;
      this.loadingCoin = true;
      this.getWalletList(this.userId);
    },750)
  };

  buildForm(){
    this.coinForm = this.fb.group({
      'coinValue': ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30), 
        Validators.pattern("^[0-9]+(.[0-9]{0,10})?$"),
      ]]
    })
    this.addForm = this.fb.group({
      'addValueCoin': ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30), 
        Validators.pattern("^[0-9]+(.[0-9]{0,10})?$"),
      ]]
    })

    this.buildSub = this.coinForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.addSub = this.addForm.valueChanges.subscribe((data) => this.onValueChangedForAddCoin(data));
    this.onValueChanged(); // reset validation messages
    this.onValueChangedForAddCoin();
  }
  
    // Updates validation state on form changes.
    onValueChanged(data?: any) {
      if (!this.coinForm) { return; }
      const form = this.coinForm;
      for (const field in this.formErrors) {
        if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'coinValue')) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            if (control.errors) {
              for (const key in control.errors) {
                if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                  this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
                }
              }
            }
          }
        }
      }
    }

    onValueChangedForAddCoin(data?: any) {
      if (!this.addForm) { return; }
      const form = this.addForm;
      for (const field in this.formErrors) {
        if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'addValueCoin')) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validMessages[field];
            if (control.errors) {
              for (const key in control.errors) {
                if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                  this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
                }
              }
            }
          }
        }
      }
    }

    link(){
      return false;
    }

    openRegistModal(){
      const modalRef = this.modalService.open(LoginUserComponent);
      $('.modal-content').animate({ opacity: 1 });
      $('.modal-backdrop').animate({ opacity: 0.9 });
    }

    public sharedLink: string;

    pushDataShareLink(){
      this.sharedLink = btoa(this.userEmail).slice(-10);
      this.sharedService.addShare(this.sharedLink, this.userId);
    }

    private sharedLinkModal;
    getSharedLink(shareLinkModal){
      this.sharedLinkModal = this.modalService.open(shareLinkModal, { windowClass: 'dark-modal' })
      $('.modal-content').animate({ opacity: 1 });
      $('.modal-backdrop').animate({ opacity: 0.9 });
    }

    deploySharedAccess(){

    }


    

    ngOnDestroy(){
      if( this.isLoggedIn == true){
       this.userSub.unsubscribe();
        this.walletSub.unsubscribe();
        this.buildSub.unsubscribe();
        this.listCompareSub.unsubscribe();
      }if(this.linkIsempty == false){
        this.userSub.unsubscribe();
        this.walletSub.unsubscribe();
        this.buildSub.unsubscribe();
        this.listCompareSub.unsubscribe();
      }
    }
  

}


