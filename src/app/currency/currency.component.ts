import { Component,ViewEncapsulation, ChangeDetectorRef, AfterViewInit, ViewChild, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators,} from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { ItemService } from '../aservices/item.service';
import { Likes } from '../aservices/Likes';
import { Currency } from '../shared/currency';
import { ListcryptocompareService} from '../aservices/listcryptocompare.service';
import "rxjs/Rx";
import { Router } from '@angular/router';
import { SpinnerLoadService } from '../spinner/spinner-load.service';
import { IsEmptyWalletService } from '../wallet/service/is-empty-wallet.service';
import { ListWalletService } from '../wallet/service/list-wallet.service'; 
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../aservices/api-service.service';
import { AuthService } from '../aservices/auth.service';
import { DislikeService } from '../aservices/dislike.service';
import { Dislikes } from '../aservices/Dislikes';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserComponent} from '../login-user/login-user.component';
import { WalletService } from '../aservices/wallet.service';
import { Wallet } from '../aservices/Wallet';
import { WalletComponent } from '../wallet/wallet.component'
import { reject } from 'q';
import { resolve } from 'url';
import * as _ from "lodash";
declare var jquery:any;
declare var $ :any;


type UserFields = 'number';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService,
     WalletService, 
     ListcryptocompareService]
})
export class CurrencyComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('autofocus') autofocus;

  name = 'Angular v4 - Applying filters to *ngFor using pipes';

  filter: Currency = new Currency();
  minfilter: Currency = new Currency();
  filters: any;

  numberForm: FormGroup ;
  formErrors: FormErrors = {
    'number': '',
  };
  validationMessages = { 
    'number': {
      'required': 'Enter a valid number greater than 0.',
      'minlength': 'Enter a valid number greater than 0.',
      'maxlength': 'Enter a valid number greater than 0.',
      'pattern': 'Enter a valid number greater than 0.',
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
  public isEmptyWallet: boolean;
  public data: Currency[] = [];
  public dataLenght:any;
  public perPage: number = 25;
  public page: number;
  public likedRow: any = NaN;
  public addedCoin: any = NaN;
  public indexWallet: number;
  public minIndex: any;
  public listCompareSub: any;
  public listComapreItem: any;
  public historicalDate: string;
  public historicalDateName: string;
  public itemsGraphic:Array<any> = [];
  public defaultChars: string = 'usd';
  public ngxValue: any[] = [];
  public walletList;
  public userId: any;
 

  constructor(
    private apiService: ApiService,
    private dislikeService: DislikeService, 
    private likeService: ItemService,
    public authService: AuthService,
    private modalService: NgbModal,
    public loginUser: LoginUserComponent,
    public walletService: WalletService,
    public fb: FormBuilder,
    public listCompare: ListcryptocompareService,
    public router: Router,
    public http: Http,
    private cdr: ChangeDetectorRef,
    public spinnerService: SpinnerLoadService,
    public ListWalletService: ListWalletService,
    private isEmptyService: IsEmptyWalletService,
    private ngbDropDownConfig: NgbDropdownConfig,
    private walletComponent: WalletComponent,
  ) {
    if (window.matchMedia('screen and (max-width: 700px)').matches){
      this.perPage = 10;
    }
    this.ngbDropDownConfig.placement='bottom-left';
    this.loadingTable = true;  
    this.spinnerService.changeMessage(true);
    this.isEmptyService.isEmptyValue.subscribe((value)=>{
      this.isEmptyWallet = value;
    })
   this.userSub = this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.loading = true;  
          this.isLoggedIn = false;
          this.dislikeValue = [];
          this.likeValue = [];
          this.connection = [];
          this.walletValue = [];
          this.buildForm();
          this.getData();
          this.page = 1;

        } else {
          this.loading = true;  
          this.isLoggedIn = true;
          this.userId = auth.uid;
          this.likes = this.likeService.getListLike();
          this.wallets = this.walletService.getListWalletFull(this.userId);
          this.walletList = this.ListWalletService.getListWallet();
          this.dislikes = this.dislikeService.getListDislike();
          this.getLikeList();
          this.getWalletList();
          this.getDislikeList();
          this.buildForm();
          this.page = 1;
        }
      });
  }

  ngOnInit(){
this.minfilter.formulaValue = Number(localStorage.getItem("minIndex"));
      if(this.minfilter.formulaValue == 0){
         this.minfilter.formulaValue = NaN;
      }
      this.filter.formulaValue = Number(localStorage.getItem("maxIndex"));
      if(this.filter.formulaValue == 0){
        this.filter.formulaValue = NaN;
     }
      this.minfilter.market_cap_usd = Number(localStorage.getItem("minMarket"));
      if(this.minfilter.market_cap_usd == 0){
        this.minfilter.market_cap_usd = NaN;
     }
      this.filter.market_cap_usd = Number(localStorage.getItem("maxMarket"));
      if(this.filter.market_cap_usd == 0){
        this.filter.market_cap_usd = NaN;
     }
      this.minfilter['24h_volume_usd'] = Number(localStorage.getItem("minVolume"));
      if(this.minfilter['24h_volume_usd'] == 0){
        this.minfilter['24h_volume_usd'] = NaN;
     }
      this.filter['24h_volume_usd'] = Number(localStorage.getItem("maxVolume"));
      if(this.filter['24h_volume_usd'] == 0){
        this.filter['24h_volume_usd'] = NaN;
     }
     this.historicalDate = localStorage.getItem('day');
     if(this.historicalDate == null){
       this.historicalDate = '7d'
     }
     this.historicalDateName = localStorage.getItem('dayName') 
     if(this.historicalDateName == null){
       this.historicalDateName ='7 days'
     }
     this.defaultChars = localStorage.getItem('symbolGraphic')
     if(this.defaultChars == null){
        this.defaultChars = 'usd'
     }
  }



  ngAfterViewInit(){
    this.cdr.detectChanges();
  }

  minIndexChange(value){
    localStorage.setItem("minIndex", value);
  }

  maxIndexChange(value){
    localStorage.setItem("maxIndex", value);
  }

  minMarketChange(value){
    localStorage.setItem("minMarket", value);
  }

  maxMarketChange(value){
    localStorage.setItem("maxMarket", value);
  }

  minVolumeChange(value){
    localStorage.setItem("minVolume", value);
  }

  maxVolumeChange(value){
    localStorage.setItem("maxVolume", value);
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

  public listWalletSub: any;
  public listWalleData: any;
  public connection: any = [];
  public dataWalletLength: any = [];
  getWalletList(){
    let promise = new Promise((resolve, reject) =>{
    this.listWalletSub = this.walletList.subscribe((data)=>{
    this.listWalleData = data;
    resolve(this.listWalleData);
    })
  });

  promise.then(()=>{
    this.walletSub = this.wallets.subscribe((walletData)=>{
      this.walletData = walletData;
      this.connection = _.map(this.listWalleData, (item) => {
        return _.assign(item, _.find(this.walletData, ['$key', item['id'] ]));
      });
     for(var i=0; i<this.connection.length; i++){
       if(this.connection[i].edit == true){
      this.dataWalletLength.push(this.connection[i]);
       }
     }
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
   })  
   
    };

    getData(){
      let promise = new Promise((resolve, reject) =>{
      this.listCompareSub = this.listCompare.get()
      .subscribe((listItem) => {
        this.listComapreItem = listItem;
        resolve(this.listComapreItem);
      })
    });

     promise.then(()=>{
   this.apiSub = this.apiService.getApi().subscribe((dataItem)=>{
       this.dataTables = dataItem; 
        this.itemsGraphic = this.dataTables
        this.newArray = this.dataTables.filter((i) => {
          return this.dislikeValue.indexOf(i.id) === -1;
       }); 

       this.data = this.newArray;
       this.dataLenght = this.newArray.length;
       this.loadingTable = false;
   
         this.loading = false; 
         this.spinnerService.changeMessage(false);
         setTimeout(()=>{
        //   this.autofocus.nativeElement.focus()
          },500) 
     });
     })

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
      }else{
       return "https://www.cryptocompare.com" + this.listComapreItem.Data[symbol].ImageUrl;
      }
    } 

    getWebPage(symbol){

      let webPage 

      symbol = (symbol === "MIOTA" ? "IOT" : symbol);
      symbol = (symbol === "VERI" ? "VRM" : symbol);
      symbol = (symbol === "ETHOS" ? "BQX" : symbol);
      symbol = (symbol === "NANO" ? "XRB" : symbol);

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
    


    doSelectGraphic(value){
       this.defaultChars = value;
       localStorage.setItem('symbolGraphic', value);
    }
  

    getChart(symbol){

      symbol = (symbol === "MIOTA" ? "IOT" : symbol);
      symbol = (symbol === "VERI" ? "VRM" : symbol);
      symbol = (symbol === "ETHOS" ? "BQX" : symbol);
      symbol = (symbol === "NANO" ? "XRB" : symbol);
      
      let dataImage = 'https://cryptohistory.org/charts/sparkline/'+ symbol +'-usd/24h/svg?lineColor=teal';

      if(this.listComapreItem.Data[symbol] === undefined){
        return "assets/noData.png";
      }else{
          if(this.defaultChars === 'usd' ){
            return dataImage
          }else if(this.listComapreItem.Data[this.defaultChars] === undefined){
            return "assets/noData.png";
          } else if(symbol === this.defaultChars) {
           return "assets/line_data.png";
          } else if(dataImage === 'Not Found') {
            return "assets/noData.png";
          } else {
            return dataImage
          }
      }
    }

    disableLinks(data){
      if (data == 'usd'){
        return true
      }else{
        return false
      }
    }


    switchDate(value){
      switch (value) {
        case '1y':
            this.historicalDate = '1y'
            this.historicalDateName = '1 year'
            localStorage.setItem('day', '1y');
            localStorage.setItem('dayName', '1 year');
            break; 
        case '30d':
            this.historicalDate = '30d'
            this.historicalDateName = '30 days'
            localStorage.setItem('day', '30d');
            localStorage.setItem('dayName', '30 days');
            break; 
        case '7d':
            this.historicalDate = '7d'
            this.historicalDateName = '7 days'
            localStorage.setItem('day', '7d');
            localStorage.setItem('dayName', '7 days');
            break; 
       case '24h':
             this.historicalDate = '24h'
             this.historicalDateName = '24 hours'
             localStorage.setItem('day', '24h');
             localStorage.setItem('dayName', '24 hours');
            break;    
       }
    }

        //sorting
        localKey: any = localStorage.getItem('sortKey');
        key: any = this.localKey == undefined ? 'market_cap_usd' : this.localKey;
         //set default
        localReverse = localStorage.getItem('sortReverse')
        reverse: any = this.localReverse == 'true' ? false : true;
        sort(key){
          localStorage.setItem("sortKey", key);
          localStorage.setItem("sortReverse", this.reverse);
          this.key = key;
          this.reverse = !this.reverse;
        }
      
        onPageChange(e, scrollDuration){
          var scrollStep = -window.scrollY / (scrollDuration / 15),
          scrollInterval = setInterval(function(){
          if ( window.scrollY != 0 ) {
              window.scrollBy( 0, scrollStep );
          }
          else clearInterval(scrollInterval); 
      },15);
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

deleteAnimation(row){
  return this.dislikeValue.indexOf(row.id) != -1;
}


getValueLike(row, i){
  if(this.isLoggedIn === false){
    this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }else{
    this.likeService.create(row.id);
    this.likedRow = i;
    setTimeout(()=>{
      this.likedRow = NaN;
    },800);
  }

};

getValueDislike(row, i){
  if(this.isLoggedIn === false){
    this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }else{
    this.dislikeService.createDislike(row.id);
   this.dataLenght = this.dataLenght - 1;
   let index = this.newArray.indexOf(row);
   setTimeout(()=>{
    this.data.splice(index, 1);
   },950)
  }
};


private path: any;
getValueWallet(row, tabWallet, i, ind, path){
  if(this.isLoggedIn === false){
    this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }else{
    this.buildForm();
    this.coins ='';
    this.path = path;
   this.currensy = this.newArray.find(myObj => myObj.id === row.id);
   this.coinsName = row.id
   this.modalWallet = this.modalService.open(tabWallet, { windowClass: 'dark-modal' })
   $('.modal-content').animate({ opacity: 1 });
   $('.modal-backdrop').animate({ opacity: 0.9 });
   this.indexWallet = i;
  }
} 

createWallet(coins){
  this.wallet.id = this.coinsName;
  this.wallet.coins = coins;
this.walletService.createWalletFromCurrency(this.path, this.wallet);
this.addedCoin = this.indexWallet;
this.router.navigate(['']);
    setTimeout(()=>{
      this.addedCoin = NaN;
    },800);
this.walletComponent.getWalletList();    
this.modalWallet.close();
}


buildForm(){
  this.numberForm = this.fb.group({
    'number': ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30), 
      Validators.pattern("^-?[0-9]+(.[0-9]{0,10})?$"),
    ]]
  })
 // this.formSub = this.numberForm.valueChanges.subscribe((data) => this.onValueChanged(data));
//  this.onValueChanged(); // reset validation messages
}



gotoDetail(id): void {
  id = (id === "MIOTA" ? "IOT" : id);
  id = (id === "VERI" ? "VRM" : id);
  id = (id === "ETHOS" ? "BQX" : id);

  if( this.listComapreItem.Data[id] === undefined){
    return
  }else{
  this.router.navigate(['currencies/', id ]);
  }
}

findDataWallet(row, i){
   let path = this.connection[i].coin;
  let d = _.findKey(path, function(o) { return o.id === row.id; });
  if(d === undefined){
    return false
  }else{
    return true
  }
}

findFullWallet(row){
  let dataCoin =[]
  if(this.isLoggedIn === false){
    return false;
  }else{

  for(var i=0; i<this.dataWalletLength.length; i++){
    let d = _.findKey(this.dataWalletLength[i].coin, function(o) { return o.id === row.id; });
    if(d != undefined){
      dataCoin.push(this.dataWalletLength[i])
    }
  }
  if(this.dataWalletLength.length == dataCoin.length){
    return true;
  }else{
    return false
  }
}
}


openRegistModule(){
  if(this.isLoggedIn === false){
    this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }
}

goToPage(data){
  this.router.navigate([data]);
}

goToDescription(name, symbol){
  let nameCoin = name.replace(/ /g,"-")
  window.open("https://cryptosorter.com/cryptocurrency/"+nameCoin+"-"+symbol, "_blank" )
}

guaedOpenWallet(){
  if(this.isLoggedIn === false){
    return 'none'
  }
  else{
    return 'dropdownWallet'
  }
}


ngOnDestroy(){
  this.userSub.unsubscribe();
    if (this.userId == null) {
      this.listCompareSub.unsubscribe();
      this.apiSub.unsubscribe();
    } else {
      this.dislikeSub.unsubscribe();
      this.likeSub.unsubscribe();
      this.walletSub.unsubscribe();
      this.listWalletSub.unsubscribe();
      this.listCompareSub.unsubscribe();
      this.apiSub.unsubscribe();
    }
}



}







