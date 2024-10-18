import { generateRoutes } from "src/app/utils/generateRoutes";
import { CadastroPlotComponent } from "./cadastro-plot/cadastro-plot.component";
import { ViewPlotComponent } from "./view-plot/view-plot.component";
import { Routes } from "@angular/router";
import { userGuard } from "src/app/guard/user.guard";

const permissions = {
    edit: true,
    create: true,
    vizualizar: true,
    listagem: true,
  };
  
  export const baseRoute = 'cadastro-plot';
  
  export const plotRoutes: Routes = generateRoutes(
    baseRoute,
    permissions,
    CadastroPlotComponent,
    ViewPlotComponent,
    userGuard,
  );
  