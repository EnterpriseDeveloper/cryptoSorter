import { Component, OnDestroy, Inject, HostListener, ViewChild, ElementRef, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import {SpinnerLoadService } from '../spinner/spinner-load.service';
import { AuthService } from '../aservices/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../login-user/login-user.component';
import {Router, ActivatedRoute} from '@angular/router';
declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  
//   animations: [
//     // Each unique animation requires its own trigger. The first argument of the trigger function is the name
//     trigger('rotatedState', [
//       state('default', style({ 
//         transform: 'rotate(0deg)'})),
//       state('rotated', style({ 
//         transform: 'rotate(180deg)',
//     })),
//       transition('rotated => default', animate('1500ms ease-out')),
//       transition('default => rotated', animate('400ms ease-in'))
//   ]),
//   trigger(
//     'Menu',
//     [
//       transition(
//       ':enter', [
//         style({transform: 'translateX(100%)', opacity: 0,
//             }),
//         animate('500ms', style({transform: 'translateX(0)', 'opacity': 1,
//                               }))
//       ]
//     ),
//     transition(
//       ':leave', [
//         style({transform: 'translateX(0)', 'opacity': 1,
//                WebkitTransform: 'translateX(0)', 
//             }),
//         animate('500ms', style({transform: 'translateX(100%)', 'opacity': 0,
//                                 WebkitTransform: 'translateX(100%)',
//                               }),
//       )]
//     )]
//   )
// ]
})
export class NavbarComponent implements OnDestroy {
public toggleTheme: boolean;
public spinnerSub: any;
public loadSpiner: boolean;
public showMenu: boolean = false;
public contetnTheme: string;
state: string = 'default';
@ViewChild('menu') menu: ElementRef;

@HostListener('document:click', ['$event'])
onDocumentClick(event) {
  if(this.showMenu == true){
    if((this.menu.nativeElement).contains(event.target)) {
      this.showMenu = true;
   } else {
     this.showMenu = false;
   } 
  }
}

// rotate() {
//     this.state = (this.state === 'default' ? 'rotated' : 'default');
// }

  constructor(public auth: AuthService, 
              private modalService: NgbModal,
              public loginUser: LoginUserComponent,
              public route: Router,
              public spinnerService: SpinnerLoadService,
              private activityRouter: ActivatedRoute,
              @Inject(DOCUMENT) private document
            ) {
              let toggleTheme = localStorage.getItem("toggleMenu");
              this.toggleTheme = JSON.parse(toggleTheme);
              if(this.toggleTheme === null){
                this.toggleTheme = false;
              }
              if(this.toggleTheme === false){
                this.contetnTheme ="Light"
              }else{
                this.contetnTheme="Dark"
              }
              this.spinnerSub = this.spinnerService.currentStatus
              .subscribe((status)=>{
              this.loadSpiner = status;
               });
            }

  logout() {
    sessionStorage.setItem('linkShare', 'login');
    this.auth.signOut();
  }

openRegistModal(){
  const modalRef = this.modalService.open(LoginUserComponent);
  $('.modal-content').animate({ opacity: 1 });
  $('.modal-backdrop').animate({ opacity: 0.9 });
}

toggle() { 
    this.showMenu = !this.showMenu;
}

changeStyle(){
  if(this.toggleTheme === false){
    this.contetnTheme ="Dark"
    this.document.getElementById('theme').setAttribute('href','assets/day.css');
   localStorage.setItem('toggleMenu', 'true')
    this.toggleTheme = true;
  }else{
    this.contetnTheme="Light"
    this.document.getElementById('theme').setAttribute('href','assets/night.css');
    localStorage.setItem('toggleMenu', 'false')
    this.toggleTheme = false;
  }
}

ngOnDestroy(){
  this.spinnerSub.unsubscribe()
}

}



