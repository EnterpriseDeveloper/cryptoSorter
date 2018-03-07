import { Component} from '@angular/core';
import { AuthService } from '../aservices/auth.service';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserComponent} from '../login-user/login-user.component'


@Component({
  selector: 'connectTable',
  templateUrl: './connect-table.component.html',
  styleUrls: ['./connect-table.component.css'],
  providers: [NgbPopoverConfig],
})
export class ConnectTableComponent {

  public isLoggedIn: boolean;

  constructor(
    public authService: AuthService,
    config: NgbPopoverConfig,
    private modalService: NgbModal,
    public loginUser: LoginUserComponent,
  )  {
    this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      }
    );
    config.placement = 'right';
    config.triggers = 'hover';
  }

  openRegistModal(){
    const modalRef = this.modalService.open(LoginUserComponent);
    $('.modal-content').animate({ opacity: 1 });
    $('.modal-backdrop').animate({ opacity: 0.9 });
  }

}

