import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlEditingRootComponent } from './control-editing-root/control-editing-root.component';
import { EditingScenariosComponent } from './editing-scenarios/editing-scenarios.component';
import { NewValuesHandlingComponent } from './new-values-handling/new-values-handling.component';



@NgModule({
  imports: [
    CommonModule
  ],

  declarations: [ControlEditingRootComponent, EditingScenariosComponent, NewValuesHandlingComponent]
})
export class ControlEditingModule { }
