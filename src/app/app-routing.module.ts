import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlEditingRootComponent } from './control-editing/control-editing-root/control-editing-root.component';
import { RunsTableTabsComponent } from './runs-table-tabs/runs-table-tabs.component';
import { MongooseSetUpComponent } from './mongoose-set-up/mongoose-set-up.component';
import { NodesComponent } from './set-up-steps/nodes/nodes.component';
import { ControlPageRootComponent } from './set-up-steps/contorl-page/control-page-root/control-page-root.component';

const routes: Routes = [
  { path: 'nodes', component: NodesComponent },
  { path: 'runs', component: RunsTableTabsComponent },
  { path: 'control', component: ControlPageRootComponent},
  { path: "", redirectTo: '/nodes', pathMatch: 'full'},
  { path: "editing-scenarios", component: ControlEditingRootComponent},

  // MARK: - Mongoose Set Up pages
  { path: "setup", component: MongooseSetUpComponent,
    children: [
      { path: 'nodes', component: NodesComponent },
      { path: 'editing-scenarios', component: ControlEditingRootComponent },
      { path: 'control', component: ControlPageRootComponent },
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
