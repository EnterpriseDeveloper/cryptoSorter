import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators,} from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject'
import { IPosts } from "../aservices/IPosts";
import { ItemService } from '../aservices/item.service';
import { Likes } from '../aservices/Likes';
import { DataTableDirective } from 'angular-datatables';
import { HeaderComponent } from '../header/header.component';

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
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

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

  dtOptions: DataTables.Settings = {};
  data: Currencies[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

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
  windowClass?: string="walletModal";
 

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
          this.tableOption();
          this.buildForm();
          this.getData();

        } else {
          this.isLoggedIn = true;
          this.tableOption();
          this.likes = this.likeService.getListLike();
          this.wallets = this.walletService.getListWallet();
          this.dislikes = this.dislikeService.getListDislike();
          this.getLikeList();
          this.getWalletList();
          this.getDislikeList();
          this.buildForm();
        }
      });
  }

  tableOption(){
    let oldStart = 0;
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [[25, 50, -1], [25, 50, "All"]],   
      "order": [[ 3, "desc" ]],
      dom: '<"top"if>rt<"bottom"lp><"clear">',
      scrollX: true,
      retrieve: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        },
      drawCallback: function (o) {
        var newStart = this.api().page.info().start;
  
        if ( newStart != oldStart ) {
            var targetOffset = $('#currency-table').offset().top;
            $('html,body').animate({scrollTop: targetOffset}, 500);
            oldStart = newStart;
        }
      }, 
    };
  }

//  ngAfterViewInit(): void {
//    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//      $('#column3_search').on( 'keyup', function () {
//        dtInstance
//            .columns( 3 )
//            .search( this.value )
//            .draw();
//    } );
//    });
//  }


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
  
        let modul = Math.abs(dataItem.percent_change_24h);
        let formula = ((dataItem['24h_volume_usd']/ ((modul / 100 ) + 1 ) / parseInt(dataItem.market_cap_usd)) * 100);
  
        let formulaInfin = (formula == Infinity) ? 0 : formula;
        let formNonNaN = (isNaN(formulaInfin) == true) ? 0 : formulaInfin;
        let formulaItem = formNonNaN.toFixed(2);
  
        return formulaItem;
  
      };
  
    var tableBodyHtml = this.newArray.map(function(dataItem) {
      return Object.assign(dataItem, {formulaValue: getFormulaValue(dataItem)});
      })
    });

    this.data = this.newArray;
    this.dtTrigger.next(); 

    this.loadingTable = false;

    setTimeout(()=>{
      this.loading = false; 
    },1000);

  };


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
    this.data.splice(i,1)
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







