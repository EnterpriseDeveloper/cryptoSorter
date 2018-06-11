import { Component, Inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";

import { AuthService } from '../aservices/auth.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../login-user/login-user.component';
import {Router, ActivatedRoute} from '@angular/router';
import {trigger, state, style, animate, transition} from '@angular/animations';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ 
        transform: 'rotate(0deg)'})),
      state('rotated', style({ 
        transform: 'rotate(180deg)'})),
      transition('rotated => default', animate('1500ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
  ]),
  trigger(
    'Menu',
    [
      transition(
      ':enter', [
        style({transform: 'translateX(100%)', opacity: 0}),
        animate('500ms', style({transform: 'translateX(0)', 'opacity': 1}))
      ]
    ),
    transition(
      ':leave', [
        style({transform: 'translateX(0)', 'opacity': 1}),
        animate('500ms', style({transform: 'translateX(100%)', 'opacity': 0}),
      )
      ]
    )]
  )
]
})
export class NavbarComponent {
public toggleTheme: boolean = false;
public showMenu: boolean = false;
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

rotate() {
    this.state = (this.state === 'default' ? 'rotated' : 'default');
}

  constructor(public auth: AuthService, 
              private modalService: NgbModal,
              public loginUser: LoginUserComponent,
              public route: Router,
              private activityRouter: ActivatedRoute,
              @Inject(DOCUMENT) private document
            ) { }

  logout() {
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
  if(this.toggleTheme == false){
    this.document.getElementById('theme').setAttribute('href','assets/day.css');
    this.toggleTheme = true;
  }else{
    this.document.getElementById('theme').setAttribute('href','assets/night.css');
    this.toggleTheme = false;
  }
}

}



