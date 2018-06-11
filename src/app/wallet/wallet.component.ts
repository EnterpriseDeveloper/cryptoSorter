import { Component, ElementRef, ViewEncapsulation, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators,} from '@angular/forms';
import { Subject } from 'rxjs/Subject'

import { ApiService} from '../aservices/api-service.service';
import { AuthService } from '../aservices/auth.service';
import { WalletService } from '../aservices/wallet.service';
import { IPosts } from '../aservices/IPosts'; 
import { Wallet } from '../aservices/Wallet';
import * as _ from "lodash";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Coins } from './coins';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { LoginUserComponent } from '../login-user/login-user.component';
import { ListcryptocompareService } from '../aservices/listcryptocompare.service';
import { SharedLinkService } from '../aservices/shared-link.service';
import { ActivatedRoute  } from '@angular/router';
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import { SpinnerLoadService } from '../spinner/spinner-load.service';
import { TotalService } from '../header/services/total.service';
import { IsEmptyWalletService } from './service/is-empty-wallet.service';
import { ListWalletService } from './service/list-wallet.service';
import { ListOfWallet } from './service/ListOfWallet';
import { SharedLinkData } from './../aservices/sharedLInkData';
import { EmailShareService } from './service/email-share.service';
import { EmailShare } from './service/EmailShare';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

declare var jquery:any;
declare var $ :any;

type UserFields = 'coinValue'| 'addValueCoin';

type FormErrors = { [u in UserFields]: string };


@Component({
  selector: 'wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})
export class WalletComponent implements OnInit, OnDestroy {

  @ViewChild('autofocus') autofocus;
  @ViewChild('foc') autofocusWallet: any;
  @ViewChild('description') description: ElementRef;
  @ViewChild('focusDescription') focusDescription: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event) {
    if(this.isLoggedIn != false){
       if (window.matchMedia('screen and (max-width: 700px)').matches){
         return
        }if(this.editingGuard == false){
         return
        } else{
          if((this.description.nativeElement).contains(event.target)) {
             this.changeInputFild();
              setTimeout(()=>{
                this.focusDescription.nativeElement.focus();
              },100)
        } else {
           this.changeInputFild2();
        };
      }
    }
  }      


  public isLoggedIn:boolean;
  public isEmptyValue: boolean;
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
  public addCoins: number;
  private newArray: any;
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
  public shareLinkAvailable: boolean;
  public guardsUnloginUsers: boolean;
  private historicalDate: string = '7d';
  private historicalDateName: string;
  private defaultChars: string = 'usd';
  private itemsGraphic: Array<any> = [];
  public wichPortfolio: string;
  public amountPortfolio = [];
  public newNameOfPortfolio: string;
  public descriptionPortfolio: string;
  public toggle: boolean = true;
  public editingGuard = true;
  public percent: number;
  public Default = 'Default';
  public userIdCreate: string;
  public descriptionPortfolioBasic: any;
  public userDescriprionForLink = false;

 coinForm: FormGroup ;
 addForm: FormGroup

  formErrors: FormErrors = {
    'coinValue': '',
    'addValueCoin': ''
  };



  validationMessages = { 
    'coinValue': {
      'required': 'Enter a valid number greater than 0.',
      'minlength': 'Enter a valid number greater than 0.',
      'maxlength': 'Enter a valid number greater than 0.',
      'pattern': 'Enter a valid number greater than 0.',
    }
  };

  validMessages = { 
    'addValueCoin': {
      'required': 'Enter a valid number greater than 0.',
      'minlength': 'Enter a valid number greater than 0.',
      'maxlength': 'Enter a valid number greater than 0.',
      'pattern': 'Enter a valid number greater than 0.',
    }
  };

  private USD = { id: "usd",
                 name: "US Dollar",
                 symbol: "usd",
                 rank: "",
                 price_usd: "1",
                 price_btc: "0",
                 ['24h_volume_usd']: "0",
                 market_cap_usd: "0",
                 available_supply: "0",
                 total_supply: "0",
                 max_supply: "0",
                 percent_change_1h: "0",
                 percent_change_24h: "0",
                 percent_change_7d: "0",
                 last_updated: "0" }

  public addNewPortfolio= { 
                            id: 'new',
                            name: 'Add new...'
                          }               


  public loading: boolean = false;

  

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    public walletService: WalletService,
    public sharedService: SharedLinkService,
    public modalService: NgbModal,
    public fb: FormBuilder,
    public listCompare: ListcryptocompareService,
    public http: Http,
    public activityRouter: ActivatedRoute,
    public db: AngularFireDatabase,
    private spinnerService: SpinnerLoadService,
    private totalService: TotalService,
    private isEmptyService: IsEmptyWalletService,
    private listWalletService: ListWalletService,
    private emailShareService: EmailShareService,
    private ngbDropDownConfig: NgbDropdownConfig
  ) {
    if(window.matchMedia('screen and (max-width: 700px)').matches){
      this.ngbDropDownConfig.placement='bottom-left';
    }else{
      this.ngbDropDownConfig.placement='bottom-right';
    }

    this.isEmptyService.isEmptyValue.subscribe((value) => {
      this.isEmptyValue = value;
    });
    this.userSub = this.authService.user.subscribe((auth) => {
        if (auth == null){
          this.isLoggedIn = false;
          this.guardsUnloginUsers = false;
          this.walletValue = [];
          this.loading = false;
          this.spinnerService.changeMessage(false); 
          this.getIdLink();
        } else {
          this.loading = true;
          this.spinnerService.changeMessage(true);   
          this.userEmail = auth.email;
          this.userId = auth.uid;
          this.userIdCreate = auth.uid
          this.guardsUnloginUsers = true;
          this.isLoggedIn = true;
          this.walletService.getListWalletFull(this.userId);
          this.getWalletList();

        this.indexListPortfolio = Number(localStorage.getItem('indexListPortfolio'))
     if(this.indexListPortfolio == null){
        this.indexListPortfolio = 0
     }

        }
      });

   }

   ngOnInit(){
    this.buildForm();
   }


   private idLink: string;
   private linkIsempty: boolean = true;

   private userIdLink: any;
   public valueLinkClosed: boolean = false;

   getIdLink(){
     this.idLink = this.activityRouter.snapshot.paramMap.get('id');
     if(this.idLink == ':id'){
       return
     }else{
      sessionStorage.setItem("linkShare", this.idLink);
       this.linkIsempty = false;
       this.loading = true;
       this.spinnerService.changeMessage(true); 
       this.isLoggedIn = true;
         this.sharedService.getShareLink(this.idLink).subscribe((shared)=>{
            this.userId = shared.uid;
            this.path = shared.path;
           if(this.userId == 'closed' || this.userId == null){
              this.loading = false;
              this.spinnerService.changeMessage(false); 
              this.isLoggedIn = false;
              this.linkIsempty = true;
            return this.valueLinkClosed = true;
           }else{
              this.userDescriprionForLink = true;
              this.percent = 100;
              this.getCoin();
            return this.valueLinkClosed = false;
           }
         })
     }
   }


   private walletListSub: any;
   public keyToPortfolio: any;
   private path: any;
   getWalletList(){ 
    this.indexListPortfolio = Number(localStorage.getItem('indexListPortfolio'))
    if(this.indexListPortfolio == null){
       this.indexListPortfolio = 0
    }
    let promise = new Promise((resolve, reject) => {
      this.walletListSub = this.listWalletService.getListWallet().subscribe((data)=> { 
      this.amountPortfolio = data ;
      this.sharedLink = data[this.indexListPortfolio].id
  
      if (!window.matchMedia('screen and (max-width: 700px)').matches){
        let addNew = this.amountPortfolio.find(myObj => myObj.id === 'new')
        if(addNew == undefined){
          this.amountPortfolio.push(this.addNewPortfolio);
        }
      }

      let nameOfPortfolio = data[this.indexListPortfolio].name;
      if(nameOfPortfolio.length >= 20){
         this.wichPortfolio = nameOfPortfolio.substring(0,20)
      }else{
         this.wichPortfolio = nameOfPortfolio
      }

      this.descriptionPortfolio = data[this.indexListPortfolio].description;
      if(this.descriptionPortfolio === undefined){
        this.descriptionPortfolio = ''
      }
      this.keyToPortfolio = data[this.indexListPortfolio].$key;
      this.path = data[this.indexListPortfolio].id;
      this.userId = data[this.indexListPortfolio].userID;
      this.editingGuard = data[this.indexListPortfolio].edit;
      this.percent = data[this.indexListPortfolio].percent;
      this.pushDataShareLink();
      resolve(this.path);
      })
    });

    promise.then(()=>{
      this.getCoin();
      this.getListOfUserEmails(this.path);
    })

  };

 
  getCoin(){
    let promise = new Promise((resolve, reject) => {
      this.walletService.getDescription(this.userId, this.path).subscribe((data)=>{
        this.descriptionPortfolioBasic = data[0].$value;
      });
    this.walletSub = this.walletService.getListWallet(this.userId, this.path).subscribe((walletData) => {
      this.walletData = walletData
      this.walletValue = [];
      this.walletData.forEach(walletData =>{
      return this.walletValue.push(walletData.id);
      })
     resolve(this.walletValue);
    })
  });

   promise.then(()=>{
     this.getData();
   }) 
  }
 



  getData(){
    this.listCompareSub = this.listCompare.get().subscribe((listItem) => {
        this.listComapreItem = listItem;
      this.apiSub = this.apiService.get().subscribe((dataItem) => {
        this.dataTables = dataItem; 
        this.dataTables.push(this.USD);
        this.itemsGraphic = this.dataTables;

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

          this.items = dataItem;
      });
    })
  }


  public defaultCoin(): void{
    let data = this.items.find(x => x.id === "bitcoin");
    console.log(data)
    return data;
  }



isEmptyFind(){
  if(this.walletValue.length > 0){
    this.isEmptyService.changePosition(false);
    this.formula()
      return this.isEmptyValue = false;
  }else{
    this.loading = false;
    this.isEmptyService.changePosition(true);
    this.spinnerService.changeMessage(false); 
    this.totalService.changeTotal(null);
    this.loadingCoin = false;
      return this.isEmptyValue = true;
  };
}

formula(){
  var old = JSON.stringify(this.connection).replace(/null/g, '0'); 
    this.newArray = JSON.parse(old);

    this.newArray.forEach(connection=>{
      var total;
      var total24_h;
      var that = this;

        connection.coins = connection.coins * this.percent / 100 ;

        function getFormulaValue(connection){
          total = connection.price_usd * connection.coins;
        return total;
        };

        function getTotal24_hValue(connection){
          total24_h = total * connection.percent_change_24h;
        return (total24_h);
        };

        var tableBodyHtml = this.newArray.map(function(connection) {
        return Object.assign(connection, {total: getFormulaValue(connection)}, 
          {total24_h: getTotal24_hValue(connection)});
        })
    });
  this.getSumma()
};


private modulTotal: number;
  getSumma(){
    this.summ = [];

    this.newArray.forEach(connect =>{
      return this.summ.push(connect.total);
    });  

    let total = _.sum(this.summ);
      this.totalSum = total.toFixed(2);
      this.totalService.changeTotal(total);

    let modulSumm = [];

    this.newArray.forEach(connectModul =>{
     return modulSumm.push(Math.abs(connectModul.total));
    });  

    this.modulTotal = _.sum(modulSumm);
    this.totalService.changeTotalM(this.modulTotal.toFixed(2));

    this.getPersantChange(this.modulTotal);
  }


getPersantChange(total){
  var persentValue = [];

    this.newArray.forEach(persent =>{
      return persentValue.push(persent.total24_h)
    })

  let persentSum = _.sum(persentValue);
  let per = persentSum/total;

  this.totalService.changePersent(per);    
  this.allocation();
}



allocation(){
  var that = this

  this.newArray.forEach(allocation=>{
    function getAllocationValue(allocation){

    allocation.percent_change_24h = Number(allocation.percent_change_24h);
    allocation.coins = Number(allocation.coins);
    allocation.price_usd = Number(allocation.price_usd);

    let allocations = (Math.abs(allocation.total)*100)/that.modulTotal;
     return allocations;
    };

    var tableBodyHtml = this.newArray.map(function(allocation) {
     return Object.assign(allocation, {allocation: getAllocationValue(allocation)});
     })
  });

  this.walletsCoin = this.newArray;
  this.loading = false; 
  this.spinnerService.changeMessage(false);
  this.loadingCoin = false;

  if(this.isLoggedIn != false){
    setTimeout(()=>{
      this.autofocus.nativeElement.focus()
    },1000)
  } 
}



symbolNoFit(symbol){
  symbol = (symbol === "MIOTA" ? "IOT" : symbol);
  symbol = (symbol === "VERI" ? "VRM" : symbol);
  symbol = (symbol === "ETHOS" ? "BQX" : symbol);
  symbol = (symbol === "NANO" ? "XRB" : symbol);
  
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
  symbol = (symbol === "NANO" ? "XRB" : symbol);

  if (symbol == "usd"){
    return "assets/dollar.png";
  };
  
  if( this.listComapreItem.Data[symbol] === undefined){
    return "assets/icon.png";
  } else{
   return "https://www.cryptocompare.com" + this.listComapreItem.Data[symbol].ImageUrl;
  };

} 

getWebPage(symbol){
  let webPage 
  symbol = (symbol === "MIOTA" ? "IOT" : symbol);
  symbol = (symbol === "VERI" ? "VRM" : symbol);
  symbol = (symbol === "ETHOS" ? "BQX" : symbol);
  symbol = (symbol === "NANO" ? "XRB" : symbol);

  if (window.matchMedia('screen and (max-width: 700px)').matches) {
    return
  }else{
    if( this.listComapreItem.Data[symbol] === undefined){
      return
    }else{
      let page = 'https://cors-anywhere.herokuapp.com/https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id='+ this.listComapreItem.Data[symbol].Id
      this.http.get(page)
       .map(res =>  res.json())
       .subscribe((web)=>{
         webPage = web;
         return  window.open(webPage.Data.General.WebsiteUrl , '_blank');
        });
    }
  }
}

    getChart(symbol){
      symbol = (symbol === "MIOTA" ? "IOT" : symbol);
      symbol = (symbol === "VERI" ? "VRM" : symbol);
      symbol = (symbol === "ETHOS" ? "BQX" : symbol);
      symbol = (symbol === "NANO" ? "XRB" : symbol);

      if(this.listComapreItem.Data[symbol] === undefined){
        return "assets/noData.png";
      }else{
          if(this.defaultChars === 'usd'){
            return 'https://cryptohistory.org/charts/sparkline/'+ symbol +'-'+ this.defaultChars +'/'+ this.historicalDate +'/svg?lineColor=white';
          }else if(this.listComapreItem.Data[this.defaultChars] === undefined){
            return "assets/noData.png";
          } else if(symbol === this.defaultChars) {
           return "assets/line_data.png";
          } else {
            return 'https://cryptohistory.org/charts/sparkline/'+ symbol +'-'+ this.defaultChars +'/'+ this.historicalDate +'/svg?lineColor=white';
          }
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
  this.currencyAdd = this.items.find(x => x.id === "bitcoin");
  this.addCoins = 0.1;
  this.addModal = this.modalService.open(addCoin, { windowClass: 'dark-modal' });
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
}

public doSelect(value: any) { 
  this.currencyAdd = this.dataTables.find(myObj => myObj.id === value);

}



createWallet(addCoins){
  this.loadingCoin = true;
  var oldCoin = this.connection.find(x => x.id === this.currencyAdd.id)
  if (oldCoin === undefined){
    this.wallet.id = this.currencyAdd.id;
    this.wallet.coins = addCoins;
    this.walletService.createWallet(this.path, this.wallet);
  }else if(oldCoin.coins >= 0){
    var coinvalue:number = Number(addCoins) + Number(oldCoin.coins);
    var key = this.walletData.find(x => x.id === this.currencyAdd.id)
    this.walletService.updateCoin(key.$key, {coins: coinvalue});
    
  }

  this.addModal.close();
  this.getWalletList();
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

    this.walletService.updateCoin(findCoin.$key,{coins: coinAmount});
    this.modalCoin.close()
    this.getWalletList();
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
      this.getWalletList();
    },750)
  };

  buildForm(){
    this.coinForm = this.fb.group({
      'coinValue': ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30), 
        Validators.pattern("^-?[0-9]+(.[0-9]{0,10})?$"),
      ]]
    })
    this.addForm = this.fb.group({
      'addValueCoin': ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30), 
        Validators.pattern("^-?[0-9]+(.[0-9]{0,10})?$"),
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
      if (!this.addForm ) { return; }
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
    public sharedLinkPush;


    pushDataShareLink(){
     this.sharedLinkPush = this.sharedService.getShareLink(this.sharedLink).subscribe((data)=>{
        if (data.uid == 'closed'){
          this.shareLinkAvailable = false;
        }else{
          this.shareLinkAvailable = true;
        }
    })

    }

   private sharedLinkModal;
   private bufferData;
    getSharedLink(shareLinkModal){
      this.showAlertDanger = false;
      this.showAlertSuccess = false;
      this.sharedLinkModal = this.modalService.open(shareLinkModal, { windowClass: 'dark-modal' })
      $('.modal-content').animate({ opacity: 1 });
      $('.modal-backdrop').animate({ opacity: 0.9 });
      this.bufferData = 'https://cryptosorter.com/portfolio/' + this.sharedLink;
      this.contetnToCopy = 'Copy to clipboard';
    }

public contetnToCopy: string = 'Copy to clipboard';
copyToClickBoard(){
  let that = this;
  function listener(e) { e.clipboardData.setData("text/plain", that.bufferData);
                         e.preventDefault(); }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
  this.contetnToCopy = 'Copied';
};


    deploySharedAccess(e){
       let isChecked = e.target.checked;
       if(isChecked == false){
         this.shareLinkAvailable = false;
         let data: SharedLinkData = new SharedLinkData
         data.path = this.sharedLink;
         data.uid = 'closed';
         this.sharedService.updateShareLink(this.sharedLink, data)
       } else {
         this.shareLinkAvailable = true;
         let data: SharedLinkData = new SharedLinkData
         data.path = this.sharedLink;
         data.uid = this.userIdCreate;
         this.sharedService.updateShareLink(this.sharedLink, data)
       }
    }

    disableLinks(data){
      if (data == 'usd'){
        return true
      }else{
        return false
      }
    }

    public addNewNamePortfolio: string;
    public moduleNewPortfolio: any;
    public indexListPortfolio: number;
    selectPortfolio(data, addNewPortfolio){
       if(data.id == 'new'){
        this.moduleNewPortfolio = this.modalService.open(addNewPortfolio, { windowClass: 'dark-modal', size: 'sm' })
        $('.modal-content').animate({ opacity: 1 });
        $('.modal-backdrop').animate({ opacity: 0.9 });
       }else{
        let nameOfPortfolio = data.name;
        if(nameOfPortfolio.length >= 20){
           this.wichPortfolio = nameOfPortfolio.substring(0,20)
        }else{
           this.wichPortfolio = nameOfPortfolio
        }
        this.descriptionPortfolio = data.description;
        this.keyToPortfolio = data.$key;
        this.indexListPortfolio = this.amountPortfolio.map(function(e) { return e.id; }).indexOf(data.id);
        localStorage.setItem('indexListPortfolio', String(this.indexListPortfolio));
        this.loadingCoin = true;
        this.getWalletList();
       }
    }


    addNewPortfolioDb(data){
      let uniqueId = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9) ;
      var dataList: ListOfWallet = new ListOfWallet
       dataList.name = data.value.name,
       dataList.userID = this.userIdCreate,
       dataList.edit = true,
       dataList.id = uniqueId,
       dataList.percent = 100,
      this.listWalletService.addListWallet(dataList);
     this.moduleNewPortfolio.close()
     this.indexListPortfolio = this.amountPortfolio.length - 2;
     localStorage.setItem('indexListPortfolio', String(this.indexListPortfolio));
     this.loadingCoin = true;
     this.createWalletDescription(uniqueId)
     this.writeLink(uniqueId);
    }

    createWalletDescription(uniqueId){
      this.walletService.createWalletDescription(uniqueId, 'Click to change portfolio description.')
    }


    writeLink(pathLink){
      let data: SharedLinkData = new SharedLinkData
      data.path = pathLink;
      data.uid = 'closed';
      this.sharedService.addShare(pathLink, data);
      this.getWalletList();
    }



    private mobuleChangeName: any;
    changeNameOfPortfolio(changeName){
      if (window.matchMedia('screen and (max-width: 700px)').matches){
        return
      }else{
        if(this.editingGuard == false){
          return
        }else{
          this.mobuleChangeName = this.modalService.open(changeName, { windowClass: 'dark-modal', size: 'sm'})
          $('.modal-content').animate({ opacity: 1 });
          $('.modal-backdrop').animate({ opacity: 0.9 })
        }
      }
    }

    changeNameDb(data){
      this.listWalletService.updateListWallet(this.keyToPortfolio, data.value);
      this.mobuleChangeName.close();
    }

    saveDescription(data){
      this.toggle = true;
     this.walletService.updateDescription(this.path, {description: data});
     this.descriptionPortfolioBasic = data;
    }

    private moduleDeletePortfolio
    private moduleGuardDeletePortfolio
    openDeleteModulePortfolio(deletePortfolioModule, guardDeletePortfolio){
      if(this.listOfEmailsUsersIsEmpty === false){
        this.moduleGuardDeletePortfolio = this.modalService.open(guardDeletePortfolio, { windowClass: 'dark-modal' });
        $('.modal-content').animate({ opacity: 1 });
        $('.modal-backdrop').animate({ opacity: 0.9 });
      }else{
        this.moduleDeletePortfolio = this.modalService.open(deletePortfolioModule, { windowClass: 'dark-modal' });
        $('.modal-content').animate({ opacity: 1 });
        $('.modal-backdrop').animate({ opacity: 0.9 });
      }
    }

    deletePortfolio(){
      var done = false;
      let promise = new Promise((resolve, reject) => {
        this.walletService.deleteFullWallet(this.path);
        this.sharedService.deleteSharedLink(this.path);
        this.listWalletService.deleteWallet(this.keyToPortfolio);
        done = true;
        resolve(done)
      })
      
      promise.then(()=>{
        this.moduleDeletePortfolio.close();
        this.indexListPortfolio = this.amountPortfolio.length - 2;
        localStorage.setItem('indexListPortfolio', String(this.indexListPortfolio));
        this.loadingCoin = true;
        this.getWalletList();
      })

    }

    changeInputFild(){
      if(this.editingGuard == false){
        return;
      }else{
        return this.toggle = false;
      }
    }
    
    changeInputFild2(){
      return this.toggle = true;
    }


    public showAlertDanger: boolean;
    public showAlertSuccess: boolean;
    public messageOfAlert: string;
    shareByEmails(data){
      this.showAlertDanger = false;
      this.showAlertSuccess = false;
      let addEmail = data.value.userEmail
      let dublicate = this.listOfEmails.find(x => x == addEmail)
      if(data.value.userEmail === this.userEmail){
         this.showAlertDanger = true;
         this.messageOfAlert = 'You can not share the portfolio with you'
      }else if(data.value.userEmail === dublicate ){
          this.showAlertDanger = true;
          this.messageOfAlert = 'Already added'
      }else if(data.value.percent < 0.00001 || data.value.percent > 100 ){
        this.showAlertDanger = true;
        this.messageOfAlert = "Percent can`t contain less that 0.00001 and more that 100"
        }else{
          let percent = data.value.percent;
          let userdata = this.authService.findEmailUsers(data.value.userEmail);
          userdata.once('value', data => {
            if(data.node_.children_.root_.key == undefined){
              this.showAlertDanger = true;
              this.messageOfAlert = 'This email is not found, please try again!'
            }else{
              data.forEach(userSnapshot => {
                let user = userSnapshot.val();
                let userKey = userSnapshot.key;
    
                var dataList: ListOfWallet = new ListOfWallet;
                dataList.name = this.wichPortfolio;
                dataList.userID = this.userIdCreate;
                dataList.description = 'From ' + this.userEmail;
                dataList.edit = false;
                dataList.id = this.path;
                dataList.percent = percent;
                this.listWalletService.shareListWallet(userKey, this.path, dataList);
  
                let emailShareData: EmailShare = new EmailShare;
                emailShareData.email = addEmail;
                emailShareData.path = this.path;
                emailShareData.percent = percent;
                emailShareData.userId = userKey;
                this.emailShareService.setEmailShare(emailShareData);
                this.showAlertSuccess = true;
                this.messageOfAlert = 'Everything went well';
                setTimeout(()=>{
                  this.showAlertSuccess = false;
                },3000);
              });
            }
         });
        } 
    }

    changeTitle(){
      if(this.editingGuard == false){
        return ''
      }else{
        return 'Click to edit'
      }
    }

    public listOfEmailsUsers: any;
    public listOfEmailsUsersIsEmpty: boolean = false;
    public listOfEmails;
    getListOfUserEmails(path){
      this.emailShareService.getListOfEmailShare(path).subscribe((dataEmail)=>{
        if(dataEmail.length === 0){
          this.listOfEmailsUsersIsEmpty = true;
        }else{
          this.listOfEmailsUsersIsEmpty = false;
        };
        this.listOfEmailsUsers = dataEmail;
        this.listOfEmails = []
        this.listOfEmailsUsers.forEach(emails =>{
          return this.listOfEmails.push(emails.email);
          })
      });
    }

    deleteShareModule: any;
    dataShareEmails: any;
    public nameOfShareEmail: any;
    OpenEmailsShare(data, deleteSharePortfolio){
      this.deleteShareModule = this.modalService.open(deleteSharePortfolio, { windowClass: 'dark-modal' });
      $('.modal-content').animate({ opacity: 1 });
      $('.modal-backdrop').animate({ opacity: 0.9 });
      this.dataShareEmails = data;
      this.nameOfShareEmail = data.email;
    }

    DeleteShareEmail(){
      this.listWalletService.deleteShareListWallet(this.dataShareEmails.userId, this.dataShareEmails.path);
      this.emailShareService.deleteEmailShare(this.dataShareEmails.$key);
      this.deleteShareModule.close();
    }

    changePerceht(data, emails){
      if(data.target.value < 0.00001 || data.target.value > 100){
        this.showAlertDanger = true;
        this.messageOfAlert = "Percent can`t contain less that 0.00001 and more that 100"
      }else{
        this.listWalletService.updateShareListWallet(emails.userId, emails.path, data.target.value);
        this.emailShareService.updateEmailShare(emails.$key, data.target.value);
        this.showAlertSuccess = true;
        this.messageOfAlert = 'Percent changed!'
        setTimeout(()=>{
          this.showAlertSuccess = false;
        },2500)
      }
 
    }


    ngOnDestroy(){
      if( this.isLoggedIn == true){
       this.userSub.unsubscribe();
        this.walletSub.unsubscribe();
      //  this.buildSub.unsubscribe();
      }if(this.linkIsempty == false){
        this.userSub.unsubscribe();
        this.walletSub.unsubscribe();
      //  this.buildSub.unsubscribe();
        this.listCompareSub.unsubscribe();
      }
    }
  

}


