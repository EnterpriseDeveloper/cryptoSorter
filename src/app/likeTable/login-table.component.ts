import { Component, ViewChild, OnDestroy} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import {Likes} from '../aservices/Likes'
import { DataTableDirective } from 'angular-datatables';
import { HeaderComponent } from '../header/header.component';

import { ItemService } from '../aservices/item.service';
import { ApiService } from '../aservices/api-service.service';
import { AuthService } from '../aservices/auth.service';
import { Resolve } from '@angular/router';
import { reject } from 'q';
declare var jquery:any;
declare var $ :any;


class Like {
  id: string;
  name: string;
  formulaValue: number;
  market_cap_usd: number;
  '24h_volume_usd': number;
  percent_change_24h: number;
  price_usd: number;
};

@Component({
  selector: 'login-table',
  templateUrl: './login-table.component.html',
  styleUrls: ['./login-table.component.css'],
  providers: [ApiService, HeaderComponent]
})
export class LoginTableComponent implements OnDestroy{
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  likeCurrency: Like[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

  private likes: Observable<Likes[]>;
  public isLoggedIn: boolean;
  public likeEmpty: boolean = false;
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

  constructor(
    private likeService: ItemService,
    private apiService: ApiService,
    private authService: AuthService,
    private headerComponent: HeaderComponent
  )  {
    this.loading = true;
   this.userSub = this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
        } else {
          this.isLoggedIn = true;
          this.likes = this.likeService.getListLike();
          this.getLikesData();
          this.option();
        }
      });
  }

    // get likes from ItemService 
    getLikesData(){
        this.likesSub = this.likes.subscribe((likeData) =>{
          this.likesData = likeData;
          this.likeValue = [];
             let result =  this.likesData.forEach(likeData =>{
               return this.likeValue.push(likeData.$value);
               });
                 this.apiSub = this.apiService.get()  
                  .subscribe((dataItem) => {
                     this.dataTables = dataItem;
                     this.filterLikes = this.dataTables.filter((i) => {
                  return this.likeValue.indexOf(i.id) != -1;
                });
                  this.isEmpty();   
              });
           });
      }

      option(){
        let oldStart = 0;
        this.dtOptions = {
          pagingType: 'full_numbers',
          lengthMenu: [[25, 50, -1], [25, 50, "All"]],
          "order": [[ 2, "desc" ]],
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
                  var targetOffset = $('#like-table').offset().top;
                  $('html,body').animate({scrollTop: targetOffset}, 500);
                  oldStart = newStart;
              }
          },  
        };

  //      var table = $( '#like-table' ).DataTable().api();

        // Delete a record
 //       table.on( 'click', '.remove', function (e) {
 //         var $tr = $(this).closest('tr');
 //         table.row($tr).remove().draw();
 //         e.preventDefault();
 //     } );
      }


  isEmpty(){
    this.isEmptyWallet = this.headerComponent.isEmpty();
    if(this.likeValue.length > 0){
      this.createTable();
     return this.likeEmpty = false;
    }else{
      this.loading = false;
    return this.likeEmpty = true;
    };
  }

  // Create index value
  createTable(){
    let old = JSON.stringify(this.filterLikes).replace(/null/g, '0'); 
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

       var tableBodyHtml = this.newArray.map((dataItem) => {
        return Object.assign(dataItem, {formulaValue: getFormulaValue(dataItem)});
        })
      });

      this.likeCurrency = this.newArray; 
      this.dtTrigger.next();  
      this.loading = false; 

    };




  //button delete likes from table
  deleteLikes(like, i){

     let likes = like.id;
      let findLike = this.likesData.find((i)=> {
        return likes.indexOf(i.$value) != -1;
     });
      this.likeService.deleteLikes(findLike.$key);
      this.newArray.splice(i, 1);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
            this.likesSub.unsubscribe();
           this.apiSub.unsubscribe();
            this.getLikesData();
       });  
  }

  ngOnDestroy(){
this.userSub.unsubscribe();
this.likesSub.unsubscribe();
this.apiSub.unsubscribe();
  }

}
