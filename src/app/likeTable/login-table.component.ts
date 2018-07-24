import { Component, ChangeDetectorRef, AfterViewInit, OnDestroy,  Input, Output, EventEmitter, ViewChild, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import {Likes} from '../aservices/Likes'

import { ItemService } from '../aservices/item.service';
import { ApiService } from '../aservices/api-service.service';
import { AuthService } from '../aservices/auth.service';
import { Resolve } from '@angular/router';
import { reject } from 'q';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserComponent } from '../login-user/login-user.component';
import { ListcryptocompareService } from '../aservices/listcryptocompare.service';
import { SpinnerLoadService } from '../spinner/spinner-load.service';
import { IsEmptyWalletService } from '../wallet/service/is-empty-wallet.service';
declare var jquery:any;
declare var $ :any;



@Component({
  selector: 'login-table',
  templateUrl: './login-table.component.html',
  styleUrls: ['./login-table.component.css'],
  providers: [ApiService]
})
export class LoginTableComponent implements  AfterViewInit, OnDestroy{

@Input() id: string;
@Input() page;
@Input() maxSize: number;

@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
@ViewChild('autofocus') autofocus;


  private likes: Observable<Likes[]>;
  public isLoggedIn: boolean;
  public loading: boolean = false;
  private dataTables;
  private likesData;
  private likeValue = [];
  public filterLikes;
  public likesSub:any;
  public apiSub:any;
  public userSub:any;
  public promise:any;
  public isEmptyWallet: boolean;
  public table:any;
  public likeCurrency:any = [];
  public likeLenght:any;
  public perPage = 25;
  public filter:any;
  public selectedRow: number;
  public listCompareSub: any;
  public listComapreItem: any;
  private items:Array<any> = [];
  private historicalDate: string;
  private historicalDateName: string;
  private defaultChars: string;

  constructor(
    private likeService: ItemService,
    private apiService: ApiService,
    private authService: AuthService,
    private modalService: NgbModal,
    private listCompare: ListcryptocompareService,
    private http: Http,
    private spinnerService: SpinnerLoadService,
    private isEmptyService: IsEmptyWalletService,
    private cdr: ChangeDetectorRef,
  )  {
   this.isEmptyService.isEmptyValue.subscribe((value)=>{
       this.isEmptyWallet = value;
   });
   this.userSub = this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
          this.spinnerService.changeMessage(false);
        } else {
          this.loading = true;
          this.spinnerService.changeMessage(true);
          this.isLoggedIn = true;
          this.likes = this.likeService.getListLike();
          this.getLikesData();
          this.page = 1;

        }
      });
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

    // get likes from ItemService 
    getLikesData(){
      let promise = new Promise((resolve, reject) =>{
        this.likesSub = this.likes.subscribe((likeData) =>{
          this.likesData = likeData;
          this.likeValue = [];
             let result =  this.likesData.forEach(likeData =>{
               return this.likeValue.push(likeData.$value);
               })
            resolve(this.likeValue);
           });
         })
         promise.then(()=>{
         this.getData();
         })     
    };

    getData(){
      this.listCompareSub = this.listCompare.get()
      .subscribe((listItem) => {
        this.listComapreItem = listItem;
      this.apiSub = this.apiService.getApi()  
      .subscribe((dataItem) => {
         this.dataTables = dataItem;
         this.items = dataItem;
         this.filterLikes = this.dataTables.filter((i) => {
      return this.likeValue.indexOf(i.id) != -1;
    });
      this.createTable();   
     });
    })
    }


  // Create index value
  createTable(){
      this.likeCurrency = this.filterLikes;
      this.likeLenght = this.likeCurrency.length;
      this.loading = false; 
      this.spinnerService.changeMessage(false);
      if(this.isLoggedIn == true){
        if(this.likeLenght != 0){
          setTimeout(()=>{
        //    this.autofocus.nativeElement.focus()
          },500)
        }
      }
    };

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

    doSelect(value){
       this.defaultChars = value;
       localStorage.setItem('symbolGraphic', value);
    }

    getChart(symbol){
      symbol = (symbol === "MIOTA" ? "IOT" : symbol);
      symbol = (symbol === "VERI" ? "VRM" : symbol);
      symbol = (symbol === "ETHOS" ? "BQX" : symbol);
      symbol = (symbol === "NANO" ? "XRB" : symbol);
      if(this.listComapreItem.Data[symbol] === undefined){
        return "assets/noData.png";
      }else{
          if(this.defaultChars === 'usd' ){
            return 'https://cryptohistory.org/charts/sparkline/'+ symbol +'-usd/24h/svg?lineColor=teal';
          }else if(this.listComapreItem.Data[this.defaultChars] === undefined){
            return "assets/noData.png";
          }  else if(symbol === this.defaultChars) {
            return "assets/line_data.png";
           } else {
             return 'https://cryptohistory.org/charts/sparkline/'+ symbol +'-usd/24h/svg?lineColor=teal';
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
        this.http         
       .get(page)
       .map(res =>  res.json())
       .subscribe((web)=>{
         webPage = web;
         return  window.open(webPage.Data.General.WebsiteUrl , '_blank');
       });
      }
    }
    }


      //sorting
  key: string = 'market_cap_usd'; //set default
  reverse: boolean = true;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  onPageChange(e){
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
          this.perPage = this.likeLenght;
          break;    
      default: 
          this.perPage = 25;
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


  //button delete likes from table
  deleteLikes(like, i){
     let likes = like.id;
      let findLike = this.likesData.find((i)=> {
        return likes.indexOf(i.$value) != -1;
     });
      this.likeService.deleteLikes(findLike.$key);
      let index = this.filterLikes.indexOf(like);
      this.selectedRow = i;
      this.likeLenght = this.likeLenght - 1;
      setTimeout(()=>{
        this.likeCurrency.splice(index, 1); 
        this.selectedRow = NaN;
      },750);
  }

  openRegistModal(){
    const modalRef = this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }

  goToDescription(name, symbol){
    let nameCoin = name.replace(/ /g,"-")
    window.open("https://cryptosorter.com/cryptocurrency/"+nameCoin+"-"+symbol, "_blank" )
  }

  ngOnDestroy(){
    if(this.isLoggedIn == true){
      this.userSub.unsubscribe();
      this.likesSub.unsubscribe();
    }
  }

}
