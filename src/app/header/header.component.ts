import { Component, OnInit, OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../aservices/auth.service';
import {SpinnerLoadService } from '../spinner/spinner-load.service';
import {TotalService} from './services/total.service';
import {Router, ActivatedRoute, NavigationEnd } from '@angular/router';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnInit ,OnDestroy{
 
  public totalSum: any = 0 ;
   public persentTotal: any = 0;
   public loading: boolean = false;
   private userSub:any;
   public persentUSD: any = 0;
   public isEmptyValue: boolean;
   public isLoggedIn: boolean;
   private linkIsempty: boolean = true;

 public myStyle: object = {};
 public	myParams: object = {};
 public width: number = 100;
 public height: number = 100;
 public loadSpiner: boolean;
 public idLink: any;

 public walletEmpty: boolean = true;


  constructor(
    public auth: AuthService,
    public spinnerService: SpinnerLoadService,
    public totalService: TotalService,
    public route: ActivatedRoute,
    public router: Router,
) {
  this.loading = true;
   this.userSub = this.auth.user.subscribe(
      (auth) => {
        if (auth != null) {
          this.isLoggedIn = true;
        } else {
           this.isLoggedIn = false;
        }
      });
  } 

 public totalModule: number; 
 public showTotalModuleL: boolean = false;
 public spinnerSub: any;
 public totalSub: any;
 public totalSubModal: any;
 public totalSubPersent: any;
  ngOnInit() {
    this.spinnerSub = this.spinnerService.currentStatus
    .subscribe((status)=>{
      this.loadSpiner = status;
    });
   this.totalSub = this.totalService.totalSum.subscribe((total)=>{
      var totals = total;
      if(totals > 0 || total < 0){
        this.isLoggedIn = true;
        this.isEmptyValue = true;
      };
      if(totals == 'empty'){
        this.isEmptyValue = false;
      };
      if(totals == 0){
        this.isEmptyValue = false;
      };
      if(totals == null){
        this.isEmptyValue = false;
      }
      this.totalSum = Number(totals).toFixed(0);
      this.loading = false;
    });

   this.totalSubModal = this.totalService.totalModule.subscribe((totalM)=>{
       let totalMod = totalM;
       let summ = ((this.totalSum - totalMod)/2).toFixed(0);
       this.totalModule = Number(summ)
       if(this.totalModule <= -1){
          this.showTotalModuleL = true;
       }else{
         this.showTotalModuleL = false;
       }
    })    

   this.totalSubPersent = this.totalService.persentSum.subscribe((persent)=>{
       let persentValue = persent;
       this.persentTotal = Number(persentValue).toFixed(2);


     let perUSD = (persentValue*this.totalSum)/100;
       this.persentUSD = Number(perUSD).toFixed(2);
     
    });
    this.myStyle = {
            'position': 'absolute',
            'width': '100%',
            'z-index': 'auto',
            'height': '450px',
            'top': 0,
            'left': 0,
            'right': 0,
            'bottom': 0,
          };
          
          this.myParams = {
            particles: {
            number: {
              value: 150,
              density: {
                enable: true,
                value_area: 1000
              }
            },
            color: {
      value: "#ffffff"
    },
    shape: {
      type: "edge",
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon: {
        nb_sides: 7
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.09,
      random: true,
      anim: {
    enable: false,
    speed: 1,
    opacity_min: 0.1,
    sync: false
  }
},
size: {
  value: 40,
  random: true,
    anim: {
      enable: false,
      speed: 21.57842157842158,
      size_min: 0.1,
      sync: false
    }
  },
    line_linked: {
      enable: true,
      distance: 25,
      color: "#000bc8",
      opacity: 1,
      width: 2
    },
    move: {
      enable: true,
      speed: 4,
      direction: "none",
      random: false,
      straight: false,
    out_mode: "bounce",
    bounce: false,
    attract: {
      enable: true,
      rotateX: 200,
      rotateY: 200
    }
  }
},
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
    enable: true,
    mode: "repulse"
    },
    onclick: {
    enable: false,
    mode: "bubble"
    },
    resize: true
    },
    modes: {
    grab: {
    distance: 300,
    line_linked: {
    opacity: 0.4
    }
    },
    bubble: {
    distance: 400,
    size: 40,
    duration: 2,
    opacity: 8,
    speed: 3
    },
    repulse: {
    distance: 100,
    duration: 0.4
    },
    push: {
    particles_nb: 4
    },
    remove: {
    particles_nb: 2
    }
    }
    },
    retina_detect: true
    }
  }


  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.spinnerSub.unsubscribe();
    this.totalSub.unsubscribe();
    this.totalSubModal.unsubscribe();
    this.totalSubPersent.unsubscribe();
     }


}