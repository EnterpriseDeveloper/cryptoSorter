import { Component, OnInit, OnDestroy } from '@angular/core';
import { IcoActiveService } from '../../aservices/ico-active.service';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'icoactive',
  templateUrl: './ico-active.component.html',
  styleUrls: ['./ico-active.component.css'],
  providers: [IcoActiveService, HeaderComponent]
})
export class IcoActiveComponent implements OnInit, OnDestroy {

  icoSub: any;
  icoData: any;
  public perPage = 25;
  public page: number;
  public dataLenght:any;
  public loading: boolean = false;
  public loadingTable: boolean = false;
  public isEmptyWallet: boolean = true;

  constructor(
    private icoActiveService: IcoActiveService,
    private headerComponent: HeaderComponent,
  ) { 
    this.isEmptyWallet = this.headerComponent.isEmpty();
    this.page = 1;
    this.loading = true;
    this.loadingTable = true;
  }

  ngOnInit() {
    this.icoSub = this.icoActiveService.getIcoActive()
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
