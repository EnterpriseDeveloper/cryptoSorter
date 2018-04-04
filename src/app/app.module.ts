import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';
import { RouterModule, Route, Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {AngularFireDatabase } from "angularfire2/database";

import {NgbModal, ModalDismissReasons, NgbActiveModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
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
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { CurrencyFilterPipe } from './shared/filter.pipe';
import { MinFilterPipe } from './shared/minFilter.pipe'; 
import { ParticlesModule } from 'angular-particle';
import { CurrencyValueChange } from './shared/number.pipe';
import { ListcryptocompareService } from './aservices/listcryptocompare.service';
import { IcoActiveComponent } from './ico/ico-active/ico-active.component';
import { IcoUpcomingComponent } from './ico/ico-upcoming/ico-upcoming.component';
import { IcoActiveService } from './aservices/ico-active.service';
import { DatePipes } from './shared/date.pipe';
import { DescriptionComponent } from './currency/description/description.component';



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
    CurrencyFilterPipe,
    MinFilterPipe,
    DatePipes,
    CurrencyValueChange,
    IcoActiveComponent,
    IcoUpcomingComponent,
    DescriptionComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxSelectModule,
    Ng2OrderModule,
    MatTabsModule,
    ParticlesModule,
    NgxPaginationModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule, 
    DataTablesModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFontAwesomeModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: CurrencyComponent },
      { path: 'favorite', component: LoginTableComponent },
      { path: 'disliked', component: DeleteTableComponent },
      { path: 'portfolio', component:WalletComponent },
      { path: 'ico/active', component: IcoActiveComponent },
      { path: 'ico/upcoming', component: IcoUpcomingComponent },
      { path: 'login', component: LoginUserComponent },
      { path: 'currencies/:id', component: DescriptionComponent },
    ])
  ],
  providers: [
    AuthService, 
    NotifyService, 
    ItemService,
    DislikeService,
    IcoActiveService,
    ListcryptocompareService,
    ApiService,
    NgbActiveModal,
    WalletService,
    LoginUserComponent,
    CurrencyComponent,
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

