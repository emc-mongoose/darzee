import { Routes } from "@angular/router";
import { MongooseSetUpComponent } from './mongoose-set-up/mongoose-set-up.component';
import { ConfigurationEditingRootComponent } from './mongoose-set-up/set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component';
import { RunsTableTabsComponent } from './runs-table/runs-table-tabs/runs-table-tabs.component';
import { NodesComponent } from './mongoose-set-up/set-up-steps/nodes/nodes.component';
import { ScenariosComponent } from './mongoose-set-up/set-up-steps/scenarios-set-up/scenarios/scenarios.component';
import { RunStatisticsComponent } from './run-statistics/run-statistics.component';
import { RoutesList } from "./routes-list";
import { RunStatisticLogsComponent } from "./run-statistics/run-statistic-logs/run-statistic-logs.component";


export const routes: Routes = [
    { path: RoutesList.NODES, component: NodesComponent },

    { path: RoutesList.RUNS, component: RunsTableTabsComponent },

    { path: RoutesList.RUN_STATISTICS + '/:id', component: RunStatisticsComponent,
      children: [
        { path: 'logs', component: RunStatisticLogsComponent}
      ] },
    { path: RoutesList.SCENARIO, component: ScenariosComponent},
    { path: "", redirectTo: RoutesList.RUNS, pathMatch: 'full'},
    { path: RoutesList.MONGOOSE_COMFIGURATION, component: ConfigurationEditingRootComponent},
  
    // MARK: - Mongoose Set Up pages
    { path: RoutesList.MONGOOSE_SETUP, component: MongooseSetUpComponent,
      children: [
        { path: RoutesList.NODES, component: NodesComponent },
        { path: RoutesList.MONGOOSE_COMFIGURATION, component: ConfigurationEditingRootComponent },
        { path: RoutesList.SCENARIO, component: ScenariosComponent },
        { path: '**', redirectTo: RoutesList.RUNS, pathMatch: 'full'}
      ]},
  ];