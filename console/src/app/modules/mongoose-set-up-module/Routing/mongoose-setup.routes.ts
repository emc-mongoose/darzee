import { Routes } from "@angular/router";
import { RoutesList } from "src/app/Routing/routes-list";
import { MongooseSetUpComponent } from "../mongoose-set-up/mongoose-set-up.component";
import { NodesComponent } from "../mongoose-set-up/set-up-steps/nodes/nodes.component";
import { ConfigurationEditingRootComponent } from "../mongoose-set-up/set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component";
import { ScenariosComponent } from "../mongoose-set-up/set-up-steps/scenarios-set-up/scenarios/scenarios.component";

export const setupRoutes: Routes = [ 
      // MARK: - Mongoose Set Up pagesRunsTableRootComponent
      { path: RoutesList.MONGOOSE_SETUP, component: MongooseSetUpComponent,
        children: [
          { path: RoutesList.NODES, component: NodesComponent },
          { path: RoutesList.MONGOOSE_COMFIGURATION, component: ConfigurationEditingRootComponent },
          { path: RoutesList.SCENARIO, component: ScenariosComponent },
          { path: RoutesList.RUNS, redirectTo: RoutesList.RUNS, pathMatch: 'full'},
          { path: '**', redirectTo: RoutesList.RUNS, pathMatch: 'full'}
        ]},
        { path: "**", component: MongooseSetUpComponent }

  
] 