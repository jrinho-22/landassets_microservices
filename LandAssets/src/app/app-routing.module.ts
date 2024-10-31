import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import dashboardRoute from './views/dashboard/routes';
import cadastroEstadoRoute from './modules/estado/routes';
import { plotRoutes } from './modules/plot/routes';
import clientPlots  from './modules/client-plot/routes';
import { salesRoutes } from './modules/sales/routes';

const routes: Routes = [
  ...cadastroEstadoRoute,
  ...plotRoutes,
  ...clientPlots,
  ...salesRoutes,
  ...dashboardRoute
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
