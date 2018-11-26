import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlEditingRootComponent } from './control-editing-root/control-editing-root.component';
import { EditingScenariosComponent } from './editing-scenarios/editing-scenarios.component';
import { NewValuesHandlingComponent } from './new-values-handling/new-values-handling.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


@NgModule({
  imports: [
    CommonModule,

    // Dependencies
    NgxJsonViewerModule
  ],

  declarations: [ControlEditingRootComponent, EditingScenariosComponent, NewValuesHandlingComponent]
})
export class ControlEditingModule { }
