import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {AngularFireDatabase } from "angularfire2/database";

import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';

import { AuthService } from './aservices/auth.service';
import { NotifyService } from './aservices/notify.service';
import { ItemService } from './aservices/item.service';
import { DislikeService} from './aservices/dislike.service';

import { AppComponent } from './app.component';
import { CurrencyComponent } from './currency/currency.component';
import { HeaderComponent } from './header/header.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { UserFormComponent } from './user-form/user-form.component';

import { environment } from './../environments/environment';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { LoginTableComponent } from './likeTable/login-table.component';
import { ConnectTableComponent } from './connect-table/connect-table.component';
import { DeleteTableComponent } from './delete-table/delete-table.component';
import { ApiService } from './aservices/api-service.service';
import { WalletComponent } from './wallet/wallet.component';
import { WalletService } from './aservices/wallet.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { SpinnerComponent } from './spinner/spinner.component';



@NgModule({
  declarations: [
    AppComponent,
    CurrencyComponent,
    HeaderComponent,
    LoginUserComponent,
    NavbarComponent,
    FooterComponent,
    UserFormComponent,
    NotificationMessageComponent,
    LoginTableComponent,
    ConnectTableComponent,
    DeleteTableComponent,
    WalletComponent,
    SpinnerComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxSelectModule,    
    MatTabsModule,
    ReactiveFormsModule, 
    DataTablesModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFontAwesomeModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component:AppComponent },
    ])
  ],
  providers: [
    AuthService, 
    NotifyService, 
    ItemService,
    DislikeService,
    ApiService,
    NgbActiveModal,
    WalletService,
    LoginUserComponent,
    CurrencyComponent,
    ConnectTableComponent,
    NavbarComponent,
    AngularFireDatabase
  ],
  bootstrap: [
    AppComponent,
    NavbarComponent,
    FooterComponent
  ],
  entryComponents: [ LoginUserComponent,
  CurrencyComponent]
})
export class AppModule { }

