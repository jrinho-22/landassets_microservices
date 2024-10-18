import { generateRoutes } from "src/app/utils/generateRoutes";
import { ViewSalesComponent } from "./view-sales/view-sales.component";
import { Routes } from "@angular/router";
import { userGuard } from "src/app/guard/user.guard";

const permissions = {
    edit: false,
    create: false,
    vizualizar: false,
    listagem: true,
  };
  
  export const baseRoute = 'view-sales';
  
  export const salesRoutes: Routes = generateRoutes(
    baseRoute,
    permissions,
    undefined,
    ViewSalesComponent,
    userGuard,
  );
  