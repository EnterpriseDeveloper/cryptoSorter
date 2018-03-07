import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject'

import { AuthService } from '../aservices/auth.service';
import { DislikeService } from '../aservices/dislike.service';
import { Dislikes } from '../aservices/Dislikes';
import { ApiService } from '../aservices/api-service.service';
import { Observable } from 'rxjs/Observable';
import { DataTableDirective } from 'angular-datatables';
import { HeaderComponent } from '../header/header.component';


class Dislike {
  id: string;
  name: string;
  formulaValue: number;
  market_cap_usd: number;
  '24h_volume_usd': number;
  percent_change_24h: number;
  price_usd: number;
};

@Component({
  selector: 'deleteTable',
  templateUrl: './delete-table.component.html',
  styleUrls: ['./delete-table.component.css'],
  providers: [ApiService, HeaderComponent]
})
export class DeleteTableComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dislikeCurrency: Dislike[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

  private dislikes: any;
  public isLoggedIn: boolean;
  public loading: boolean = false;
  public isEmptyValue: boolean = false;
  private dataTables;
  private dislikesData;
  private dislikeValue = [];
  private filterDislike;
  private newArray:any;
  private userSub: any;
  private apiSub: any;
  private dislikeSub: any;
  public isEmptyWallet: boolean = false;
  public table:any;

  constructor(
    private dislikeService: DislikeService, 
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
          this.dislikes = this.dislikeService.getListDislike();
          this.getDislikeList();
        }
      }
    );
  }

  ngOnInit(){

  }

    // get dislike from DislikeService
    getDislikeList(){
      let oldStart = 0;
      this.dtOptions = {
        pagingType: 'full_numbers',
        lengthMenu: [[25, 50, -1], [25, 50, "All"]],
        "order": [[ 2, "desc" ]],
        dom: '<"top"if>rt<"bottom"lp><"clear">',
        scrollX: true,
        destroy: false,
        retrieve: true,
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Search records",
          },
          drawCallback: function (o) {
            var newStart = this.api().page.info().start;
      
            if ( newStart != oldStart ) {
                var targetOffset = $('#delete-table').offset().top;
                $('html,body').animate({scrollTop: targetOffset}, 500);
                oldStart = newStart;
            }
        }    
      };

      this.dislikeSub = this.dislikes.subscribe((dislikeData)=>{
         this.dislikesData = dislikeData;
         this.dislikeValue = [];
         this.dislikesData.forEach(dislikeData =>{
          return this.dislikeValue.push(dislikeData.$value);
         })
         this.apiSub = this.apiService.get()  
         .subscribe((dataItem) => {
           this.dataTables = dataItem;
           this.filterDislike = this.dataTables.filter((i) => {
             return this.dislikeValue.indexOf(i.id) != -1;
           });
           this.isEmptyWallet = this.headerComponent.isEmpty();
           console.log(this.isEmptyWallet)
             this.isEmpty(); 
         });
      });
    }


    isEmpty(){
      if(this.dislikeValue.length > 0){
        this.createTable();
      return this.isEmptyValue = false;
      }else{
       this.loading = false;
       return this.isEmptyValue = true;
      };
    }



  // Create index value
  createTable(){

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

      this.dislikeCurrency = this.newArray;
     this.table = this.dtTrigger.next(); 
      this.loading = false; 

    };


   
  //button delete dslikes from button
  deleteDislike(dislike, i){
    let dislikes = dislike.id;
    let findDislike = this.dislikesData.find((i) => {
      return dislikes.indexOf(i.$value) != -1;
    });
    this.dislikeService.deleteDislike(findDislike.$key);
    this.newArray.splice(i, 1);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dislikeSub.unsubscribe();
        this.apiSub.unsubscribe();
        this.getDislikeList();
      });
  } 

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.dislikeSub.unsubscribe();
    this.apiSub.unsubscribe();
  }


}
