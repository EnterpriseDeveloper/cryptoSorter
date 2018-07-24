import {Component, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../aservices/auth.service';
import { from } from 'rxjs/observable/from';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'login',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css'],
  
})
export class LoginUserComponent {


  constructor (
    private auth: AuthService,
    private router: Router,
    public activeModal: NgbActiveModal,
    
  ){
  }


  signInWithGoogle() {
    this.auth.googleLogin()
      .then(() => this.afterSignIn());
  }

  signInWithFacebook() {
    this.auth.facebookLogin()
      .then(() => this.afterSignIn());
  }

 private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
  //  this.router.navigate(['/']);
    this.activeModal.close();
  }

};

 