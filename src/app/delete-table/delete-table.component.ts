import { Component, OnDestroy, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject'

import { AuthService } from '../aservices/auth.service';
import { DislikeService } from '../aservices/dislike.service';
import { Dislikes } from '../aservices/Dislikes';
import { ApiService } from '../aservices/api-service.service';
import { Observable } from 'rxjs/Observable';
import { HeaderComponent } from '../header/header.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../login-user/login-user.component';
import { ListcryptocompareService } from '../aservices/listcryptocompare.service';


@Component({
  selector: 'deleteTable',
  templateUrl: './delete-table.component.html',
  styleUrls: ['./delete-table.component.css'],
  providers: [ApiService, HeaderComponent]
})
export class DeleteTableComponent implements OnDestroy {

 @Input() id: string;
@Input() page;
@Input() maxSize: number;

@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
@ViewChild('autofocus') autofocus;

  private dislikes: any;
  public isLoggedIn: boolean;
  public loading: boolean = false;
  private dataTables;
  private dislikesData;
  private dislikeValue = [];
  private filterDislike;
  private newArray:any;
  private userSub: any;
  private apiSub: any;
  private dislikeSub: any;
  public isEmptyWallet: boolean = true;
  public table:any;
  public dislikeCurrency: any = [];
  public dislikeLenght:any;
  public perPage = 25;
  public filter:any;
  public selectedRow: number;
  public listCompareSub: any;
  public listComapreItem: any;


  constructor(
    private dislikeService: DislikeService, 
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
          this.dislikes = this.dislikeService.getListDislike();
          this.getDislikeList();
          this.page = 1;      
        }
      }
    );
  }

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
      this.listCompareSub = this.listCompare.get()
      .subscribe((listItem) => {
        this.listComapreItem = listItem;
      this.apiSub = this.apiService.get()  
      .subscribe((dataItem) => {
        this.dataTables = dataItem;  
        this.filterDislike = this.dataTables.filter((i) => {
          return this.dislikeValue.indexOf(i.id) != -1;
       });  
       this.isEmptyWallet = this.headerComponent.isEmpty();
       this.createTable(); 
      });
     })
    }


  // Create index value
  createTable(){

    let old = JSON.stringify(this.filterDislike).replace(/null/g, '0'); 
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

       var tableBodyHtml = this.newArray.map(function(dataItem) {
        return Object.assign(dataItem, {formulaValue: getFormulaValue(dataItem)});
        })
      });

      this.dislikeCurrency = this.newArray;
      this.dislikeLenght = this.dislikeCurrency.length;
      this.loading = false; 

      if(this.isLoggedIn == true){
        if(this.dislikeLenght != 0){
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
          this.perPage = this.dislikeLenght;
          break;    
      default: 
          this.perPage = 25;
     }
  }


   
  //button delete dslikes from button
  deleteDislike(dislike, i){
    let dislikes = dislike.id;
    let findDislike = this.dislikesData.find((i) => {
      return dislikes.indexOf(i.$value) != -1;
    });
    let index = this.newArray.indexOf(dislike);
    this.selectedRow = i;
    this.dislikeService.deleteDislike(findDislike.$key);
    this.dislikeLenght = this.dislikeLenght - 1;
     setTimeout(()=>{
       this.dislikeCurrency.splice(index, 1);
       this.selectedRow = NaN;
     },750)
  } 

  openRegistModal(){
    const modalRef = this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }


  ngOnDestroy(){
    if(this.isLoggedIn == true){
      this.userSub.unsubscribe();
      this.dislikeSub.unsubscribe();
    }
  }


}
