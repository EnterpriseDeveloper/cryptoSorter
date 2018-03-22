import { Component, ViewEncapsulation, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  public isLoggedIn:boolean;
  public isEmptyValue: boolean = false;
  public walletValue: any = [];
  public wallets: Observable<Wallet[]>;
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
    public modalService: NgbModal,
    public fb: FormBuilder,
    public headerComponent: HeaderComponent,
  ) {
    this.loading = true;  
    this.userSub = this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
          this.walletValue = [];
        } else {
          this.isLoggedIn = true;
          this.wallets = this.walletService.getListWallet();
          this.getWalletList();
        }
      });
   }

   ngOnInit(){
    this.buildForm();
   }


   getWalletList(){ 
 this.walletSub = this.wallets.subscribe((walletData)=>{
      this.walletData = walletData;
      this.walletValue = [];
      this.isEmptyWallet = this.headerComponent.isEmpty();
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

 setTimeout(()=>{
  this.autofocus.nativeElement.focus()
 },500)

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
   return this.chosenCur = true;
  };
}

createWallet(addCoins){
  this.wallet.id = this.currencyAdd.id;
  this.wallet.coins = addCoins;
  this.walletService.createWallet(this.wallet);
  this.addModal.close();
}

getValueCoin(wallet, tabCoin){
  this.modalCoin = this.modalService.open(tabCoin, { windowClass: 'dark-modal' })
  $('.modal-content').animate({ opacity: 1 });
  $('.modal-backdrop').animate({ opacity: 0.9 });
  this.coin = this.walletsCoin.find(myObj => myObj.id === wallet.id);
  this.coinAmount = this.coin.coins;
};


  updateAmount(coin, coinAmount: number,){
    let coins = coin.id;
    let findCoin = this.walletData.find((i)=> {
      return coins.indexOf(i.id) != -1;
    });
    this.walletService.updateCoin(findCoin.$key,{coins: coinAmount} );
    this.modalCoin.close()
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

    ngOnDestroy(){
this.userSub.unsubscribe();
this.walletSub.unsubscribe();
this.buildSub.unsubscribe();
    }
  

}


