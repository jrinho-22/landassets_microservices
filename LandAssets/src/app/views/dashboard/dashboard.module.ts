import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateModel } from './models/estate.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShortSummaryComponent } from './components/short-summary/short-summary.component';
import { PlotActionsComponent } from './components/plot-actions/plot-actions.component';
import { CarouselComponent } from 'src/app/components/carousel/carousel.component';
import { DashboardComponent } from './dashboard.component';
import { FlatButtonComponent } from 'src/app/components/buttons/flat-button/flat-button.component';
import { TextfieldComponent } from 'src/app/components/inputs/textfield/textfield.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from 'src/app/components/inputs/select/select.component';
import { DashboardService } from './utils/dashboard.service';
import { PlotModel } from './models/plot.service';
import { MatDialogModule } from '@angular/material/dialog';
import { FormComponent } from 'src/app/components/form/form.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ModalBuyPlotComponent } from './components/plot-actions/modals/modal-buy-plot/modal-buy-plot.component';
import { MODAL_BUY_PLOT_VALUES } from '../../tokens/modal-token';
import { BehaviorSubject } from 'rxjs';
import IModalBuyPlotValues from 'src/app/interfaces/plot-actions/IModalBuyPlotValues';
import { ChartComponent } from 'src/app/components/chart/chart.component';
import { MatInputModule } from '@angular/material/input';
import { FormSelectComponent } from 'src/app/components/inputs/form-select/form-select.component';
import ISale from 'src/app/interfaces/ISale';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CloudinaryModule } from '@cloudinary/ng';

@NgModule({
  declarations: [
    ShortSummaryComponent,
    PlotActionsComponent,
    DashboardComponent,
    ModalBuyPlotComponent,
  ],
  imports: [
    CloudinaryModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    SelectComponent,
    FormSelectComponent,
    MatProgressSpinnerModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule,
    FormComponent,
    CommonModule,
    CarouselComponent,
    FlatButtonComponent,
    TextfieldComponent,
    ChartComponent
  ],
  exports: [MatProgressSpinnerModule, FormSelectComponent, MatTooltipModule, CloudinaryModule],
  providers: [
    EstateModel,
    DashboardService,
    PlotModel,
    {
      provide: MODAL_BUY_PLOT_VALUES,
      useValue: new BehaviorSubject<IModalBuyPlotValues | ISale>({}),
    },
  ],
})
export class DashboardModule { }
