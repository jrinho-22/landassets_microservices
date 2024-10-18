import { ViewClientPlotComponent } from './view-client-plot/view-client-plot.component';
import { generateRoutes } from 'src/app/utils/generateRoutes';
import { Routes } from '@angular/router';

const permissions = {
  edit: false,
  create: false,
  vizualizar: false,
  listagem: true,
};

export const baseRoute = 'my-plots';

const routes: Routes = generateRoutes(
  baseRoute,
  permissions,
  undefined,
  // PaymentClientPlotComponent,
  ViewClientPlotComponent,
);

export default routes;
