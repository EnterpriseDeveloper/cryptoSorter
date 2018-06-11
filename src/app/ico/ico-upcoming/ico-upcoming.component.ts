import { Component, OnInit, OnDestroy } from '@angular/core';
import {IcoUpcomingService} from '../service/ico-upcoming.service';
import {SpinnerLoadService } from '../../spinner/spinner-load.service';
import {IsEmptyWalletService} from '../../wallet/service/is-empty-wallet.service';
import {IcoDbService} from '../service/ico-db.service';
import {ICO} from '../service/ICO';
import {AuthService} from '../../aservices/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../../login-user/login-user.component';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'icoupcoming',
  templateUrl: './ico-upcoming.component.html',
  styleUrls: ['./ico-upcoming.component.css'],
  providers: []
})
export class IcoUpcomingComponent implements OnInit, OnDestroy {

  icoSub: any;
  icoData: any;
  public perPage = 25;
  public page: number;
  public dataLenght:any;
  public loading: boolean = false;
  public loadingTable: boolean = false;
  public isEmptyWallet: boolean;
  private icoLike : ICO = new ICO;
  public icoLikeData : any;
  public icoLikes: any;
  public icoDataLike = [];
  public contetnToCopy: string;
  public registUser: boolean;

  constructor(
    private icoUpcomingService: IcoUpcomingService,
    private spinnerService: SpinnerLoadService,
    private isEmptyService: IsEmptyWalletService,
    private icoDbService: IcoDbService,
    private authService: AuthService,
    private modalService: NgbModal,
    private config: NgbTooltipConfig

  ) {
    if(window.matchMedia('screen and (max-width: 700px)').matches){
      this.config.triggers='false';
   }else{
    this.config.triggers='hover';
   } 
  this.spinnerService.changeMessage(false);
  this.isEmptyService.isEmptyValue.subscribe((value)=>{
    this.isEmptyWallet = value;
  })
    this.page = 1;
    this.loading = true;
    this.loadingTable = true;
    this.authService.user.subscribe(
      (auth)=>{
        if(auth != null){
         this.icoLikeData = this.icoDbService.getListIcoLikes();
         this.icoLikeDataBase();
         this.registUser = true;
        }else{
          this.registUser = false;
          this.icoDataLike = [];
        }
    })
  }

  ngOnInit() {
    this.icoSub = this.icoUpcomingService.getIcoUpcoming()
     .subscribe((data)=>{
       this.icoData = data;
       this.dataLenght = this.icoData.length;
       this.loading = false;
       this.loadingTable = false;
    })
  }

  icoLikeDataBase(){
    this.icoLikeData.subscribe((data)=>{
      this.icoLikes = data;
      this.icoLikes.forEach(dataDb =>{
        return this.icoDataLike.push(dataDb.name);
      })
    })
  }

  getIcoLikeStyle(ico){
    return this.icoDataLike.indexOf(ico.name) != -1;
  };

  text(ico){
    if(this.registUser == false){
      this.contetnToCopy ='Register to Click&Save';
    }else{
      let search = this.icoDataLike.find(x => x === ico.name)
      if(search == ico.name){
        this.contetnToCopy ='Unsave this ICO';
      }else{
        this.contetnToCopy = 'Save this ICO';
      }
    }
  }

  addToLikeIco(data: any){
    if(this.registUser == false){
      const modalRef = this.modalService.open(LoginUserComponent);
      $('.modal-content').animate({ opacity: 1 });
      $('.modal-backdrop').animate({ opacity: 0.9 });
    }else{
      let search = this.icoDataLike.find(x => x === data.name)
      if(search == data.name){
        let likesDelete = data.name;
        let deleteIco = this.icoLikes.find((i) => {
          return likesDelete.indexOf(i.name) != -1;
        });
        this.icoDbService.deleteIcoLikes(deleteIco.$key);
  
        this.icoDataLike = this.icoDataLike.filter(x => x !== data.name);

          this.contetnToCopy ='Save this ICO';
      } else {
        this.icoLike.name = data.name,
        this.icoLike.image = data.image,
        this.icoLike.website = data.website,
        this.icoLike.start_time = data.start_time,
        this.icoLike.end_time = data.end_time,
        this.icoLike.description = data.description
        this.icoDbService.createIcoLikes(this.icoLike);
        this.contetnToCopy ='Unsave this ICO';
      }
    }
  };

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
