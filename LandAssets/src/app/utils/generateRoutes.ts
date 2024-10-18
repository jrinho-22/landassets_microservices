import { Type } from '@angular/core';
import { CanActivateFn, Routes } from '@angular/router';

export const generateRoutes = (
  path: string,
  permission: {
    edit: boolean;
    create: boolean;
    vizualizar: boolean;
    listagem: boolean;
  },
  createComponent?: Type<any>,
  viewComponent?: Type<any>,
  guard?: CanActivateFn
): Routes => {
  let routes: Routes = [];
  if (permission.vizualizar && createComponent) {
    routes.push({ path: `${path}/vizualizar/:id`, component: createComponent });
  }
  if (permission.edit && createComponent) {
    routes.push({ path: `${path}/editar/:id`, component: createComponent });
  }
  if (permission.create && createComponent) {
    routes.push({ path: path, component: createComponent });
  }
  if (permission.listagem && viewComponent) {
  routes.push({ path: `${path}/listar`, component: viewComponent });
  }
  if (guard) {
    routes[routes.length - 1].canActivate = [guard]
  }

  return routes;
};
