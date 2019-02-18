import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodesComponent } from './nodes/nodes.component';
import { ControlPageRootComponent } from './contorl-page/control-page-root/control-page-root.component';
import { ControlEditingRootComponent } from './control-editing/control-editing-root/control-editing-root.component';
import { RunsTableTabsComponent } from './runs-table-tabs/runs-table-tabs.component';

const routes: Routes = [
  { path: 'nodes', component: NodesComponent },
  { path: 'runs', component: RunsTableTabsComponent },
  { path: 'control', component: ControlPageRootComponent},
  { path: "", redirectTo: '/nodes', pathMatch: 'full'},
  { path: "editing-scenarios", component: ControlEditingRootComponent}
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
