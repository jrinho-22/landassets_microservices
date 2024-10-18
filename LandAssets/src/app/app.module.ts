import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './views/header/header.component';
import { FlatButtonComponent } from './components/buttons/flat-button/flat-button.component';
import { LogoComponent } from './components/logo/logo.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { TextfieldComponent } from './components/inputs/textfield/textfield.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './views/dashboard/dashboard.module';
import { SelectComponent } from './components/inputs/select/select.component';
import { CadastroEstadoComponent } from './modules/estado/cadastro-estado/cadastro-estado.component';
import { MatGridListModule } from "@angular/material/grid-list";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewEstadoComponent } from './modules/estado/view-estado/view-estado.component';
import { TableComponent } from './components/table/table.component';
import { FormComponent } from './components/form/form.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoginComponent } from './views/login/login.component'
import { ChartComponent } from './components/chart/chart.component';
import { CadastroPlotComponent } from './modules/plot/cadastro-plot/cadastro-plot.component';
import { ViewPlotComponent } from './modules/plot/view-plot/view-plot.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { InputMaskModule } from '@ngneat/input-mask';
import { FORM_SUBMIT } from './tokens/formSubmitHandler';
import { ViewClientPlotComponent } from './modules/client-plot/view-client-plot/view-client-plot.component';
import { ModalPaymentComponent } from './modules/client-plot/modals/payment/payment.component';
import { FormRadioComponent } from './components/inputs/form-radio/form-radio.component';
import { IconButtonComponent } from './components/buttons/icon-button/icon-button.component';
import { ViewSalesComponent } from './modules/sales/view-sales/view-sales.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CadastroEstadoComponent,
    ViewEstadoComponent,
    LoginComponent,
    CadastroPlotComponent,
    ViewPlotComponent,
    SnackbarComponent,
    ViewClientPlotComponent,
    ModalPaymentComponent,
    ViewSalesComponent,
  ],
  imports: [
    InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true }),
    IconButtonComponent,
    FormRadioComponent,
    CurrencyMaskModule,
    ChartComponent,
    TableComponent,
    ModalComponent,
    MatGridListModule,
    SelectComponent,
    DashboardModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormComponent,
    LogoComponent,
    AppRoutingModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlatButtonComponent,
    CarouselComponent,
    TextfieldComponent,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DATA, useValue: {} },
    {
      provide: FORM_SUBMIT,
      useValue: new BehaviorSubject({
        formSubmitted: false
      }),
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
