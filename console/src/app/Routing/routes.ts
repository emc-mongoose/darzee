import { Routes } from "@angular/router";
import { MongooseSetUpComponent } from '../modules/mongoose-set-up-module/mongoose-set-up/mongoose-set-up.component';
import { ConfigurationEditingRootComponent } from '../modules/mongoose-set-up-module/mongoose-set-up/set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component';
import { NodesComponent } from '../modules/mongoose-set-up-module/mongoose-set-up/set-up-steps/nodes/nodes.component';
import { ScenariosComponent } from '../modules/mongoose-set-up-module/mongoose-set-up/set-up-steps/scenarios-set-up/scenarios/scenarios.component';
import { RunStatisticsComponent } from '../run-statistics/run-statistics.component';
import { RoutesList } from "./routes-list";
import { RunStatisticLogsComponent } from "../run-statistics/run-statistic-logs/run-statistic-logs.component";
import { RunStatisticsChartsComponent } from "../run-statistics/run-statistics-charts/run-statistics-charts.component";
import { RouteParams } from "./params.routes";
import { RunsTableRootComponent } from "../runs-table/runs-table-root/runs-table-root.component";


export const routes: Routes = [
    { path: RoutesList.NODES, component: NodesComponent },

    { path: RoutesList.RUNS, component: RunsTableRootComponent },

    { path: RoutesList.RUN_STATISTICS + '/:' + RouteParams.ID, component: RunStatisticsComponent,
      children: [
        { path: RoutesList.RUN_LOGS, component: RunStatisticLogsComponent},
        { path: RoutesList.RUN_CHARTS, component: RunStatisticsChartsComponent}
      ] },
    { path: RoutesList.SCENARIO, component: ScenariosComponent},
    { path: "", redirectTo: RoutesList.RUNS, pathMatch: 'full'},
    { path: RoutesList.MONGOOSE_COMFIGURATION, component: ConfigurationEditingRootComponent},
  
    { path: RoutesList.MONGOOSE_SETUP, component: MongooseSetUpComponent}, 
      { path: "**", component: RunsTableRootComponent }
  ];