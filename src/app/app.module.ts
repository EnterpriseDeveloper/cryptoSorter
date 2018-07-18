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
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSelectModule } from 'ngx-select-ex';
import { environment } from './../environments/environment';
//import { ParticlesModule } from 'angular-particle';

import { CurrencyFilterPipe } from './shared/filter.pipe';
import { MinFilterPipe } from './shared/minFilter.pipe'; 
import { CurrencyValueChange } from './shared/number.pipe';
import { DatePipes } from './shared/date.pipe';

import { SharedLinkService } from './aservices/shared-link.service';
import {SpinnerLoadService } from './spinner/spinner-load.service';
import {TotalService} from './header/services/total.service';
import {IsEmptyWalletService} from './wallet/service/is-empty-wallet.service';
import {IcoDbService} from './ico/service/ico-db.service';
import { IcoActiveService } from './ico/service/ico-active.service';
import { IcoUpcomingService } from './ico/service/ico-upcoming.service';
import { AuthService } from './aservices/auth.service';
import { NotifyService } from './aservices/notify.service';
import { ItemService } from './aservices/item.service';
import { DislikeService} from './aservices/dislike.service';
import { ListcryptocompareService } from './aservices/listcryptocompare.service';
import { ApiService } from './aservices/api-service.service';
import { WalletService } from './aservices/wallet.service';
import { ListWalletService } from './wallet/service/list-wallet.service';
import { EmailShareService } from './wallet/service/email-share.service';

import { DescriptionComponent } from './currency/description/description.component';
import { IcoLikeComponent } from './ico/ico-like/ico-like.component';
import { IcoActiveComponent } from './ico/ico-active/ico-active.component';
import { IcoUpcomingComponent } from './ico/ico-upcoming/ico-upcoming.component';
import { AppComponent } from './app.component';
import { CurrencyComponent } from './currency/currency.component';
import { HeaderComponent } from './header/header.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { UserFormComponent } from './user-form/user-form.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { LoginTableComponent } from './likeTable/login-table.component';
import { ConnectTableComponent } from './connect-table/connect-table.component';
import { DeleteTableComponent } from './delete-table/delete-table.component';
import { WalletComponent } from './wallet/wallet.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ChartService } from './currency/description/service/chart.service';
import { ChartDayService } from './currency/description/service/chart-day.service';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import stock from 'highcharts/modules/stock.src';
import more from 'highcharts/highcharts-more.src';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [stock, more];
}

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
    DescriptionComponent,
    IcoLikeComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxSelectModule,
    Ng2OrderModule,
    MatTabsModule,
   // ParticlesModule,
    ChartModule,
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
        { path: '', component: CurrencyComponent},
        { path: 'favorite', component: LoginTableComponent},
        { path: 'disliked', component: DeleteTableComponent},
        { path: 'portfolio', component:WalletComponent},
        { path: 'portfolio/:id', component:WalletComponent},
        { path: 'ico/active', component: IcoActiveComponent},
        { path: 'ico/upcoming', component: IcoUpcomingComponent },
        { path: 'login', component: LoginUserComponent},
        { path: 'cryptocurrency/:id', component: DescriptionComponent},
        { path: 'ico/saved', component: IcoLikeComponent}
    ]),
  ],
  providers: [
    AuthService, 
    NotifyService, 
    ItemService,
    DislikeService,
    IcoActiveService,
    ListcryptocompareService,
    ApiService,
    SharedLinkService,
    NgbActiveModal,
    SpinnerLoadService,
    WalletService,
    TotalService,
    LoginUserComponent,
    CurrencyComponent,
    NavbarComponent,
    AngularFireDatabase,
    IsEmptyWalletService,
    IcoDbService,
    IcoUpcomingService,
    ListWalletService,
    EmailShareService,
    WalletComponent,
    ChartService,
    ChartDayService,
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
  ],
  bootstrap: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
  ],
  entryComponents: [ LoginUserComponent,
  CurrencyComponent]
})
export class AppModule { }

