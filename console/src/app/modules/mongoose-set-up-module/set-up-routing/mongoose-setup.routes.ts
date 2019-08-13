import { Routes } from "@angular/router";
import { RoutesList } from "src/app/modules/app-module/Routing/routes-list";
import { MongooseSetUpComponent } from "../components/mongoose-set-up/mongoose-set-up.component";
import { NodesComponent } from "../components/mongoose-set-up/set-up-steps/nodes/nodes.component";
import { ConfigurationEditingRootComponent } from "../components/mongoose-set-up/set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component";
import { ScenariosComponent } from "../components/mongoose-set-up/set-up-steps/scenarios-set-up/scenarios/scenarios.component";
import { SetupStepsGuard } from "src/app/modules/mongoose-set-up-module/set-up-routing/guards/setup-steps.guard";

export const SETUP_ROUTES: Routes = [
  { path: RoutesList.NODES, component: NodesComponent },
  { path: RoutesList.MONGOOSE_COMFIGURATION, component: ConfigurationEditingRootComponent, canActivate: [SetupStepsGuard] },
  { path: RoutesList.SCENARIO, component: ScenariosComponent, canActivate: [SetupStepsGuard] },
  { path: RoutesList.RUNS, redirectTo: RoutesList.RUNS, pathMatch: 'full' },
  { path: '**', redirectTo: RoutesList.RUNS, pathMatch: 'full' },
  { path: "**", component: MongooseSetUpComponent }
] 