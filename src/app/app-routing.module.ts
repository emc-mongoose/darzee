import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlEditingRootComponent } from './set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component';
import { RunsTableTabsComponent } from './runs-table-tabs/runs-table-tabs.component';
import { MongooseSetUpComponent } from './mongoose-set-up/mongoose-set-up.component';
import { NodesComponent } from './set-up-steps/nodes/nodes.component';
import { ScenariosComponent } from './set-up-steps/scenarios-set-up/scenarios/scenarios.component';

const routes: Routes = [
  { path: 'nodes', component: NodesComponent },
  { path: 'runs', component: RunsTableTabsComponent },
  { path: 'control', component: ScenariosComponent},
  { path: "", redirectTo: '/nodes', pathMatch: 'full'},
  { path: "configuration-editing.component", component: ControlEditingRootComponent},

  // MARK: - Mongoose Set Up pages
  { path: "setup", component: MongooseSetUpComponent,
    children: [
      { path: 'nodes', component: NodesComponent },
      { path: 'configuration-editing.component', component: ControlEditingRootComponent },
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
