import { Component } from '@angular/core';

import { AuthService } from '../aservices/auth.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../login-user/login-user.component';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public auth: AuthService, 
       private modalService: NgbModal,
    public loginUser: LoginUserComponent,) { }

  logout() {
    this.auth.signOut();
  }

openRegistModal(){
  const modalRef = this.modalService.open(LoginUserComponent);
  $('.modal-content').animate({ opacity: 1 });
  $('.modal-backdrop').animate({ opacity: 0.9 });
}

}



