import { Component, OnDestroy,  Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import {Likes} from '../aservices/Likes'
import { HeaderComponent } from '../header/header.component';

import { ItemService } from '../aservices/item.service';
import { ApiService } from '../aservices/api-service.service';
import { AuthService } from '../aservices/auth.service';
import { Resolve } from '@angular/router';
import { reject } from 'q';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../login-user/login-user.component';
import { ListcryptocompareService } from '../aservices/listcryptocompare.service';
declare var jquery:any;
declare var $ :any;



@Component({
  selector: 'login-table',
  templateUrl: './login-table.component.html',
  styleUrls: ['./login-table.component.css'],
  providers: [ApiService, HeaderComponent]
})
export class LoginTableComponent implements OnDestroy{

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
  public newArray: any;
  public likesSub:any;
  public apiSub:any;
  public userSub:any;
  public promise:any;
  public isEmptyWallet: boolean = true;
  public table:any;
  public likeCurrency:any = [];
  public likeLenght:any;
  public perPage = 25;
  public filter:any;
  public selectedRow: number;
  public listCompareSub: any;
  public listComapreItem: any;

  constructor(
    private likeService: ItemService,
    private apiService: ApiService,
    private authService: AuthService,
    private headerComponent: HeaderComponent,
    private modalService: NgbModal,
    private listCompare: ListcryptocompareService,
    private http: Http
  )  {
   this.userSub = this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
        } else {
          this.loading = true;
          this.isLoggedIn = true;
          this.likes = this.likeService.getListLike();
          this.getLikesData();
          this.page = 1;
        }
      });
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
      this.apiSub = this.apiService.get()  
      .subscribe((dataItem) => {
         this.dataTables = dataItem;
         this.filterLikes = this.dataTables.filter((i) => {
      return this.likeValue.indexOf(i.id) != -1;
    });
      this.isEmptyWallet = this.headerComponent.isEmpty();
      this.createTable();   
     });
    })
    }


  // Create index value
  createTable(){
    let old = JSON.stringify(this.filterLikes).replace(/null/g, '0'); 
    this.newArray = JSON.parse(old);

    this.newArray.forEach(dataItem => {
   
       function getFormulaValue(dataItem) {

        dataItem['24h_volume_usd'] = Number.parseInt(dataItem['24h_volume_usd']);

        dataItem.percent_change_24h = Number(dataItem.percent_change_24h);
  
        dataItem.price_usd = Number(dataItem.price_usd);
  
        dataItem.market_cap_usd = Number.parseInt(dataItem.market_cap_usd);
   
        let modul = Math.abs(dataItem.percent_change_24h);
        let formula = ((dataItem['24h_volume_usd']/ ((modul / 100 ) + 1 ) / parseInt(dataItem.market_cap_usd)) * 100);
   
         let formulaInfin = (formula == Infinity) ? 0 : formula;
         let formNonNaN = (isNaN(formulaInfin) == true) ? 0 : formulaInfin;
         let formulaItem = formNonNaN.toFixed(2);
   
         return Number(formulaItem);
   
       };

       var tableBodyHtml = this.newArray.map((dataItem) => {
        return Object.assign(dataItem, {formulaValue: getFormulaValue(dataItem)});
        })
      });

      this.likeCurrency = this.newArray;
      this.likeLenght = this.likeCurrency.length;
      this.loading = false; 

      if(this.isLoggedIn == true){
        if(this.likeLenght != 0){
          setTimeout(()=>{
            this.autofocus.nativeElement.focus()
          },500)
        }
      }
    };

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
  key: string = 'market_cap_usd'; //set default
  reverse: boolean = true;
  sort(key){
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
          this.perPage = this.likeLenght;
          break;    
      default: 
          this.perPage = 25;
     }
  }


  //button delete likes from table
  deleteLikes(like, i){
     let likes = like.id;
      let findLike = this.likesData.find((i)=> {
        return likes.indexOf(i.$value) != -1;
     });
      this.likeService.deleteLikes(findLike.$key);
      let index = this.newArray.indexOf(like);
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

  ngOnDestroy(){
    if(this.isLoggedIn == true){
      this.userSub.unsubscribe();
      this.likesSub.unsubscribe();
    }
  }

}
