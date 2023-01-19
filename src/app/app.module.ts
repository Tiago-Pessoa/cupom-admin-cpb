import { FlexLayoutModule } from '@angular/flex-layout';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CupomAdmComponent } from './cupom-adm/cupom-adm.component';

import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { CupomEdicaoComponent } from './cupom-edicao/cupom-edicao.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingComponent } from './loading/loading.component';
import { LoadingInterceptor } from './loading.interceptor';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SharedModule } from './shared/shared.module';


registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    CupomAdmComponent,
    CupomEdicaoComponent,
    LoadingComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
