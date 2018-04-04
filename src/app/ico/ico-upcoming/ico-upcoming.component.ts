import { Component, OnInit, OnDestroy } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import { HeaderComponent } from '../../header/header.component';
import "rxjs/Rx";

@Component({
  selector: 'icoupcoming',
  templateUrl: './ico-upcoming.component.html',
  styleUrls: ['./ico-upcoming.component.css'],
  providers: [HeaderComponent]
})
export class IcoUpcomingComponent implements OnInit, OnDestroy {

  icoSub: any;
  icoData: any;
  public perPage = 25;
  public page: number;
  public dataLenght:any;
  public loading: boolean = false;
  public loadingTable: boolean = false;
  public isEmptyWallet: boolean = true;

  constructor(
    private http: Http,
    private headerComponent: HeaderComponent,
  ) { 
    this.isEmptyWallet = this.headerComponent.isEmpty();
    this.page = 1;
    this.loading = true;
    this.loadingTable = true;
  }

  ngOnInit() {
    this.icoSub = this.http         
     .get("https://cors-anywhere.herokuapp.com/https://chasing-coins.com/api/v1/icos/upcoming")
     .map(res =>  res.json())
     .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
     .subscribe((data)=>{
       this.icoData = data;
       this.dataLenght = this.icoData.length;
       this.loading = false;
       this.loadingTable = false;
    })
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


  ngOnDestroy(){
    this.icoSub.unsubscribe();
  }

}
