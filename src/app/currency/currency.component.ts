import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators,} from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject'
import { IPosts } from "../aservices/IPosts";
import { ItemService } from '../aservices/item.service';
import { Likes } from '../aservices/Likes';
import { HeaderComponent } from '../header/header.component';
import { Currency } from '../shared/currency';

import { ApiService } from '../aservices/api-service.service';
import { AuthService } from '../aservices/auth.service';
import { DislikeService } from '../aservices/dislike.service';
import { Dislikes } from '../aservices/Dislikes';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserComponent} from '../login-user/login-user.component';
import { WalletService } from '../aservices/wallet.service';
import { Wallet } from '../aservices/Wallet';
import { reject } from 'q';
import { resolve } from 'url';
declare var jquery:any;
declare var $ :any;


type UserFields = 'number';
type FormErrors = { [u in UserFields]: string };

class Currencies {
  id: string;
  name: string;
  formulaValue: number;
  market_cap_usd: number;
  '24h_volume_usd': number;
  percent_change_24h: number;
  price_usd: number;
};

@Component({
  selector: 'currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  providers: [ApiService, WalletService, HeaderComponent]
})
export class CurrencyComponent implements OnDestroy{

  name = 'Angular v4 - Applying filters to *ngFor using pipes';

  filter: Currency = new Currency();

  numberForm: FormGroup ;
  formErrors: FormErrors = {
    'number': '',
  };
  validationMessages = { 
    'number': {
      'required': 'Coins is required.',
      'minlength': 'Coins must be at least 1 characters long.',
      'maxlength': 'Coins cannot be more than 30 characters long.',
      'pattern': 'Cannot contain more than 10 characters after the point',
    }
  };


  private dislikes: Observable<Dislikes[]>;
  private likes: Observable<Likes[]>;
  private dataTables: any;
  private dislikesData: any;
  private dislikeValue: any = [];
  private likesData: any;
  private likeValue: any = [];
  private walletValue: any = [];
  private walletData: any;
  private filterDislike: any;
  public isLoggedIn: boolean;
  public apiSub: any;
  public likeSub: any;
  public dislikeSub: any;
  public walletSub: any;
  public currensy: any;
  public stopTimer: any;
  public wallet : Wallet = new Wallet;
  public wallets: any;
  public coinsName: number;
  public modalWallet: any;
  public coins:any = '';
  public loading: boolean = false;
  public loadingTable: boolean = false;
  public newArray: any;
  public userSub: any;
  public formSub: any;
  public isEmptyWallet: any;
  public data: Currency[] = [];
  public dataLenght:any;
  public perPage = 25;
  public page: number;
 

  constructor(
    private apiService: ApiService,
    private dislikeService: DislikeService, 
    private likeService: ItemService,
    public authService: AuthService,
    private modalService: NgbModal,
    public loginUser: LoginUserComponent,
    public walletService: WalletService,
    public fb: FormBuilder,
    public headerComponent: HeaderComponent  ) {
    this.loading = true;  
    this.loadingTable = true;  
   this.userSub = this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
          this.dislikeValue = [];
          this.likeValue = [];
          this.walletValue = [];
          this.buildForm();
          this.getData();
          this.page = 1;

        } else {
          this.isLoggedIn = true;
          this.likes = this.likeService.getListLike();
          this.wallets = this.walletService.getListWallet();
          this.dislikes = this.dislikeService.getListDislike();
          this.getLikeList();
          this.getWalletList();
          this.getDislikeList();
          this.buildForm();
          this.page = 1;
        }
      });
  }

  // get likes from ItemService 
  getLikeList(){
    this.likeSub = this.likes.subscribe((likeData)=>{
      this.likesData = likeData;
        this.likesData.forEach(likeData =>{
         return this.likeValue.push(likeData.$value);
       })
    })
  };

  getWalletList(){
    this.walletSub = this.wallets.subscribe((walletData)=>{
      this.isEmptyWallet = this.headerComponent.isEmpty();
      this.walletData = walletData;
        this.walletData.forEach(walletData =>{
        return this.walletValue.push(walletData.id);
      })
    })
    
  };

    // get dislike from DislikeService
    getDislikeList(){
      let promise = new Promise((resolve, reject) =>{
        this.dislikeSub = this.dislikes.subscribe((dislikeData)=>{
          this.dislikesData = dislikeData
          this.dislikesData.forEach(dislikeData =>{
          return this.dislikeValue.push(dislikeData.$value);
           })
          resolve(this.dislikeValue);
        })
      });

   promise.then(()=>{
     this.getData();
   }
  )     
    };

    getData(){
      this.apiSub = this.apiService.get()  
      .subscribe((dataItem) => {
        this.dataTables = dataItem;  
        this.filterDislike = this.dataTables.filter((i) => {
          return this.dislikeValue.indexOf(i.id) === -1;
       });  
       this.index(); 
    });
    }


  // Create index value
  index(){
    let old = JSON.stringify(this.filterDislike).replace(/null/g, '0'); 
    this.newArray = JSON.parse(old);

   this.newArray.forEach(dataItem => {
  
     function getFormulaValue(dataItem) {

      dataItem['24h_volume_usd'] = Number.parseInt(dataItem['24h_volume_usd']);

      dataItem.percent_change_24h = Number.parseInt(dataItem.percent_change_24h);

      dataItem.price_usd = Number.parseInt(dataItem.price_usd);

      dataItem.market_cap_usd = Number.parseInt(dataItem.market_cap_usd);
  
        let modul = Math.abs(dataItem.percent_change_24h);
        let formula = ((dataItem['24h_volume_usd']/ ((modul / 100 ) + 1 ) / parseInt(dataItem.market_cap_usd)) * 100);
  
        let formulaInfin = (formula == Infinity) ? 0 : formula;
        let formNonNaN = (isNaN(formulaInfin) == true) ? 0 : formulaInfin;
        let formulaItem = formNonNaN.toFixed(2);
  
        return Number(formulaItem);
  
      };
  
    var tableBodyHtml = this.newArray.map(function(dataItem) {
      return Object.assign(dataItem, {formulaValue: getFormulaValue(dataItem)});
      })
    });

    this.data = this.newArray;
    this.dataLenght = this.newArray.length;
    this.loadingTable = false;

      this.loading = false; 

  };

        //sorting
        key: string = 'market_cap_usd'; //set default
        reverse: boolean = true;
        sort(key){
          this.key = key;
          this.reverse = !this.reverse;
        }
      
        onPageChange(e)
        {
          if (e)
            this.page = e;
        }
      
        link(){
          return false;
        }
      
        switchCase(value){
          switch (value) {
            case '25':
                this.perPage = 25;
                break; 
            case '50':
                this.perPage = 50;
                break; 
           case 'all':
                this.perPage = this.dataLenght;
                break;    
            default: 
                this.perPage = 25;
           }
        }


likesColor(row){
  return this.likeValue.indexOf(row.id) != -1;
}

getValueLike(row){
  if(this.isLoggedIn === false){
    this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }else{
    this.likeService.create(row.id);
  }

};

getValueDislike(row, i){
  if(this.isLoggedIn === false){
    this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }else{
    this.dislikeService.createDislike(row.id);
    let index = (this.page - 1) * this.perPage + i;
    this.data.splice(index, 1)
  }
};

getValueWallet(row, tabWallet){
  if(this.isLoggedIn === false){
    this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }else{
    this.coins = '';
   this.currensy = this.filterDislike.find(myObj => myObj.id === row.id);
   this.coinsName = row.id
   this.modalWallet = this.modalService.open(tabWallet, { windowClass: 'dark-modal' })
   $('.modal-content').animate({ opacity: 1 });
   $('.modal-backdrop').animate({ opacity: 0.9 });
  }
} 

createWallet(coins){
  this.wallet.id = this.coinsName;
  this.wallet.coins = coins;
this.walletService.createWallet(this.wallet);
this.modalWallet.close();
}


buildForm(){
  this.numberForm = this.fb.group({
    'number': ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30), 
      Validators.pattern("^[0-9]+(.[0-9]{0,10})?$"),
    ]]
  })
  this.formSub = this.numberForm.valueChanges.subscribe((data) => this.onValueChanged(data));
  this.onValueChanged(); // reset validation messages
}

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.numberForm) { return; }
    const form = this.numberForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'number')) {
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


walletColor(row){
  return this.walletValue.indexOf(row.id) != -1;
}


ngOnDestroy(){
this.userSub = this.authService.user.subscribe(
  (auth) => {
    if (auth == null) {
      this.formSub.unsubscribe();
      this.apiSub.unsubscribe();
    } else {
      this.dislikeSub.unsubscribe();
      this.likeSub.unsubscribe();
      this.walletSub.unsubscribe();
      this.formSub.unsubscribe();
    }
  }
);
}



}







