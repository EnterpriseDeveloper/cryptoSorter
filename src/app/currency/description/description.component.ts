import { Component, OnInit, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { ListcryptocompareService} from '../../aservices/listcryptocompare.service';
import { Http ,Response } from '@angular/http';
import { ApiService } from '../../aservices/api-service.service';
import {ItemService} from '../../aservices/item.service';
import {DislikeService} from '../../aservices/dislike.service';
import {AuthService} from '../../aservices/auth.service';
import { LoginUserComponent} from '../../login-user/login-user.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ChartService} from './service/chart.service';
import {ChartData} from './service/ChartData';
import {ChartDayService} from './service/chart-day.service';
import { StockChart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { SpinnerLoadService } from '../../spinner/spinner-load.service';
import _ from 'lodash/core';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css'],
  providers: [ApiService, ListcryptocompareService]
})
export class DescriptionComponent implements OnInit {

  public symbol = '';
  public id: any = '';
  public data: any = '';
  public dataApi: any = 0;
  public likeData: boolean = false;
  public dislikeData: boolean = false;
  public likeDataSub: any;
  public dislikeDataSub: any;
  public userSub: any;
  public loading: boolean = false;
  public login: boolean = false;
  public likeCurrency: any;
  public dislikeCurrency: any;
  public price: any = [];
  public stock: StockChart;
  private day: string;
  public loadingChart = true;
  public max;
  public min;
  private time;
  public resultArray
  public loading$ = true;



  constructor(
    public route: ActivatedRoute,
    public listCompare: ListcryptocompareService,
    public http: Http,
    public apiService: ApiService,
    public likeService: ItemService,
    public dislikeService: DislikeService,
    public authService: AuthService,
    public modalService: NgbModal,
    public chartService: ChartService,
    public chartDayService: ChartDayService,
    public spinnerService: SpinnerLoadService,
  ) {
    this.spinnerService.changeMessage(true);
    let id = this.route.snapshot.paramMap.get('id');
    document.title = id + " cryptocurrency: news, trading signals, price chart, market overview";
    var $meta = $('meta[name=Description]').attr('content', 
    "Check out " + id + " cryptocurrency today's price chart and trends, social media pages and official website. Read latest news and earn " + id + " with know-how engineered " + id + " trading signals, or research the market with CryptoSorter' Crypto Volatility Index indicator.");
    this.symbol = id.substr(id.lastIndexOf("-") + 1);
    this.loading = true;
    this.userSub = this.authService.user.subscribe(
      (auth) => {
      if(auth != null){
        this.login = true;
        this.likeDataSub = this.likeService.getListLike();
        this.dislikeDataSub = this.dislikeService.getListDislike() 
        this.getData();
      }else{
        this.loading = true;
        this.getData();
      }
      })
   }
   
  ngOnInit() {
  }



   getData(){
    var promise = new Promise((resolve, reject)=>{
      this.listCompare.get().subscribe((data)=>{
        this.id = data.Data[this.symbol];
        resolve(this.id.Id)
      })
    })
    
    promise.then((res)=>{
      this.loading$ = true
      let page = 'https://cors-anywhere.herokuapp.com/https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id='+ res
      this.http         
     .get(page)
     .do(()=> { this.loading$ = false })
     .map(res =>  res.json())
     .subscribe((data)=>{
      this.data = data;
      this.getDataChars();
     });
    })
    this.getAPI();
  }

  getAPI(){
    this.apiService.getApi().subscribe((data)=>{
      this.dataApi = data.find(x => x.symbol === this.symbol );
      if(this.login === true){
        this.likeDataSub.subscribe((data)=>{
          this.likeCurrency = data.find(x=>x.$value === this.dataApi.id)
          if(this.likeCurrency === undefined){
            this.likeData = false;
          }else{
            this.likeData = true;
          }
         })
  
         this.dislikeDataSub.subscribe((data)=>{
          this.dislikeCurrency = data.find(x=>x.$value === this.dataApi.id)
          if(this.dislikeCurrency === undefined){
            this.dislikeData = false;
          }else{
            this.dislikeData = true;
          }
        })
       }
       }) 
       setTimeout(()=>{
        this.loading = false;
       },1000)
  }

  getDataChars(){ 
let promise = new Promise((res, rej)=>{
  this.chartService.getChartData(this.symbol).subscribe((data)=>{
    let i = data.Data.length - 1
    this.max = data.Data[i].time
    this.min = data.Data[0].time;
    var dataForPrice;
    var priceData =[];
  data.Data.forEach(element => {
   dataForPrice = [
     element.time * 1000, 
     element.close
   ]
  priceData.push(dataForPrice);
  this.loadingChart = false;
    })   
    this.price = priceData;
    res(this.price);
  })
})
promise.then((data)=>{

let dataChart = data;
this.day = 'histohour'
let d = new Date();
let timeMax = (d.getTime() / 1000).toFixed(0);
this.chartDayService.getChartData(this.day ,this.symbol, timeMax).subscribe((data)=>{
  var dataForPrice;
  var price = []
data.Data.forEach(element => {
 dataForPrice = [
   element.time * 1000, 
   element.close
 ]
price.push(dataForPrice);

  })

  this.resultArray = []
  this.resultArray = Array.prototype.concat.apply([], [dataChart, price]).sort(this.sortFunction)
   this.price = this.resultArray


    this.stock = new StockChart({
      colors:['#0d6e6d'],
    rangeSelector: {
      selected: 1,
      buttons: [{
          type: 'day',
          count: 1,
          text: '1d',
       }, {
        type: 'day',
        count: 7,
        text: '7d'
       }, {
        type: 'month',
        count: 1,
        text: '1m'
      }, {
          type: 'month',
          count: 3,
          text: '3m'
      }, {
          type: 'year',
          count: 1,
          text: '1y'
      }, {
          type: 'all',
          text: 'All'
      }],
      
  },
    title: {
      text: this.data.Data.General.H1Text + " / USD Price Chart"
    },
    
    series: [{
      name: "Price",
      data: this.price,
        }],
        tooltip: {
          split: false,
          xDateFormat: '%m/%d/%y %H:%M',
          pointFormat: "<b>Price (USD):</b> {point.y:,.6f}",

        },
        xAxis: {
          events: {
            afterSetExtremes:(event)=>{
                var timeMax = Number((event.max / 1000).toFixed(0));
                this.time = ((event.max/1000)-(event.min/1000)).toFixed(0);
                if(Number(this.time) <= 120000){
                  let dataToday = Date.now()
                  let day7 = dataToday - 15724800000
                  if( day7 <= event.max ){
                    this.day = 'histominute';
                  }else{
                    this.day = 'histohour';
                  }
                this.chartDayService.getChartData(this.day ,this.symbol, timeMax).subscribe((data)=>{
                  this.stock.ref.showLoading();
                  var dataForPrice;
                  var price =[]
                  data.Data.forEach(element => {
                    dataForPrice = [
                      element.time * 1000, 
                      element.close
                    ]
                   price.push(dataForPrice);
               
                     })
                     this.resultArray = []
                     this.resultArray = Array.prototype.concat.apply([], [this.price, price]).sort(this.sortFunction)

                 this.stock.ref.series[0].setData(this.resultArray);
                 setTimeout(()=>{
                  this.stock.ref.hideLoading();
                 },1000)
 
                   })

                }else if(Number(this.time) >= 120001 && Number(this.time) <= 7862400){
                  this.day = 'histohour'
                  this.chartDayService.getChartData(this.day ,this.symbol, timeMax).subscribe((data)=>{
                    this.stock.ref.showLoading();
                    var dataForPrice;
                    var price = []
                  data.Data.forEach(element => {
                   dataForPrice = [
                     element.time * 1000, 
                     element.close
                   ]
                  price.push(dataForPrice);
              
                    })

                    this.resultArray = []
                    this.resultArray = Array.prototype.concat.apply([], [this.price, price]).sort(this.sortFunction)
                     this.stock.ref.series[0].setData(this.resultArray);
                     setTimeout(()=>{
                      this.stock.ref.hideLoading();
                     },1000)
                 

                  })

                }else if(Number(this.time) >= 7862401){
                  this.day = 'histoday'
                  this.chartService.getChartData(this.symbol).subscribe((data)=>{
                    this.stock.ref.showLoading();
                    var dataForPrice;
                    var dataForVolume;
                    let price =[]
                  data.Data.forEach(element => {
                   dataForPrice = [
                     element.time * 1000, 
                     element.close
                   ]
                  price.push(dataForPrice);
              
                    })
                 //   this.stock.ref$.subscribe(ref => {
                 //     ref.series[0].update({ data: price }, true);
                 //   });
                  this.stock.ref.series[0].setData(price);
                    this.stock.ref.hideLoading();
                  })
                }
            }
        },
         min: this.min * 1000,
         max: this.max * 1000,
        },
      });
    });
  })
    this.spinnerService.changeMessage(false);
  }

  likeRemove(){
    if(this.login === false){
      this.modalService.open(LoginUserComponent);
      $('.modal-content').animate({ opacity: 1 });
      $('.modal-backdrop').animate({ opacity: 0.9 });
    }else{
      if(this.likeData === false){
        this.likeService.create(this.dataApi.id)
      }else if(this.likeData === true){
        this.likeService.deleteLikes(this.likeCurrency.$key);
      }
  }
  }

  sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
}

  dislikeRemove(){
    if(this.login === false){
      this.modalService.open(LoginUserComponent);
      $('.modal-content').animate({ opacity: 1 });
      $('.modal-backdrop').animate({ opacity: 0.9 });
    }else{
      if(this.dislikeData === false){
        this.dislikeService.createDislike(this.dataApi.id);
      } else if(this.dislikeData === true){
        this.dislikeService.deleteDislike(this.dislikeCurrency.$key);
      }
    }
  }


}
