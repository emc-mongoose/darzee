import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MongooseSetUpComponent } from './mongoose-set-up/mongoose-set-up.component';
import { ConfigurationEditingRootComponent } from './mongoose-set-up/set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component';
import { RunsTableTabsComponent } from './runs-table/runs-table-tabs/runs-table-tabs.component';
import { NodesComponent } from './mongoose-set-up/set-up-steps/nodes/nodes.component';
import { ScenariosComponent } from './mongoose-set-up/set-up-steps/scenarios-set-up/scenarios/scenarios.component';

const routes: Routes = [
  { path: 'nodes', component: NodesComponent },
  { path: 'runs', component: RunsTableTabsComponent },
  { path: 'control', component: ScenariosComponent},
  { path: "", redirectTo: '/nodes', pathMatch: 'full'},
  { path: "configuration-editing.component", component: ConfigurationEditingRootComponent},

  // MARK: - Mongoose Set Up pages
  { path: "setup", component: MongooseSetUpComponent,
    children: [
      { path: 'nodes', component: NodesComponent },
      { path: 'configuration-editing.component', component: ConfigurationEditingRootComponent },
      { path: 'control', component: ScenariosComponent },
      { path: '**', redirectTo: 'nodes', pathMatch: 'full'}
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
