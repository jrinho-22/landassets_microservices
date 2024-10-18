import { CadastroEstadoComponent } from './cadastro-estado/cadastro-estado.component';
import { ViewEstadoComponent } from './view-estado/view-estado.component';
import { generateRoutes } from 'src/app/utils/generateRoutes';
import { Routes } from '@angular/router';
import { userGuard } from 'src/app/guard/user.guard';

const permissions = {
  edit: true,
  create: true,
  vizualizar: true,
  listagem: true,
};

export const baseRoute = 'cadastro-estado';

const routes: Routes = generateRoutes(
  baseRoute,
  permissions,
  CadastroEstadoComponent,
  ViewEstadoComponent,
  userGuard
);

export default routes;
