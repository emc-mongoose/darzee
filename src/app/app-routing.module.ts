import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MongooseSetUpComponent } from './mongoose-set-up/mongoose-set-up.component';
import { ConfigurationEditingRootComponent } from './mongoose-set-up/set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component';
import { RunsTableTabsComponent } from './runs-table/runs-table-tabs/runs-table-tabs.component';
import { NodesComponent } from './mongoose-set-up/set-up-steps/nodes/nodes.component';
import { ScenariosComponent } from './mongoose-set-up/set-up-steps/scenarios-set-up/scenarios/scenarios.component';
import { RoutesList } from './routes';

const routes: Routes = [
  { path: RoutesList.NODES, component: NodesComponent },
  { path: RoutesList.RUNS, component: RunsTableTabsComponent },
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

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
