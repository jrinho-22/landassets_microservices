import { userGuard } from "src/app/guard/user.guard";
import { DashboardComponent } from "./dashboard.component";
import { Route } from "@angular/router";

const dashboardPath = 'dashboard'

const dashboardRoute: Route = {
  path: dashboardPath,
  component: DashboardComponent,
};

const fallBackRoute: Route = {
  path: "**",
  redirectTo: dashboardPath,
};


export default [dashboardRoute, fallBackRoute]