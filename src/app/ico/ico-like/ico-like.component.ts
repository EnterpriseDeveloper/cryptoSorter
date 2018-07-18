import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../aservices/auth.service';
import { IcoDbService } from '../service/ico-db.service';
import {SpinnerLoadService } from '../../spinner/spinner-load.service';
import {IsEmptyWalletService} from '../../wallet/service/is-empty-wallet.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import {LoginUserComponent} from '../../login-user/login-user.component';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-ico-like',
  templateUrl: './ico-like.component.html',
  styleUrls: ['./ico-like.component.css'],
  providers: [IcoDbService],
  encapsulation: ViewEncapsulation.None
})
export class IcoLikeComponent implements OnDestroy {

  public icoLikes: any;
  public dataLenght:any;
  public loading: boolean = false;
  public loadingTable: boolean = false;
  public perPage = 25;
  public page: number;
  public isEmptyWallet: boolean;
  public contetnToCopy = 'Remove from Saved';
  public registUser: boolean

  constructor(
    private auth: AuthService,
    private icoDbService: IcoDbService,
    private spinnerService: SpinnerLoadService,
    private isEmptyService: IsEmptyWalletService,
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
    this.auth.user.subscribe((auth)=>{
      if(auth == null){
       this.registUser = false;
       this.loading = false;
       this.loadingTable = false;
      }else{
        this.registUser = true;
     this.icoLikes = this.icoDbService.getListIcoLikes();
     this.getDataIcoLike()
      }
    })
  }

  private IcoSub: any;
  public icoData: any = [];
  getDataIcoLike(){
    this.IcoSub = this.icoLikes.subscribe((data)=>{
      this.icoData = data;
      this.dataLenght = this.icoData.length;
      this.loading = false;
      this.loadingTable = false;
    })
  }

  public icoLikeModule: string;
  public dataToDeleteIco: any;
  public modalWindow: any;
  public index: any;
  openModuleDelete(icoLike, deleteIco, i){
    this.modalWindow = this.modalService.open( deleteIco, { windowClass: 'dark-modal'}, );
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
    this.icoLikeModule = icoLike.name;
    this.dataToDeleteIco = icoLike;
    this.index = i;
  }

  deletedRow: number;
  deleteIcoDb(){
    this.deletedRow = this.index;
    this.modalWindow.close();
    setTimeout(()=>{
      this.icoDbService.deleteIcoLikes(this.dataToDeleteIco.$key);
      this.deletedRow = NaN;
    },750)
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

  openRegistModal(){
    const modalRef = this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }

  ngOnDestroy(){
    this.auth.user.subscribe((auth)=>{
      if(auth != null){
    this.IcoSub.unsubscribe();
      }
    })
  }


}
