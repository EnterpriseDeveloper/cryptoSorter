import { Component, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";

import { AuthService } from '../aservices/auth.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../login-user/login-user.component';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
public toggleTheme: boolean = false;

  constructor(public auth: AuthService, 
              private modalService: NgbModal,
              public loginUser: LoginUserComponent,
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



