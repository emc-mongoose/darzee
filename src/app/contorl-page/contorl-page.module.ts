import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPageRootComponent } from './control-page-root/control-page-root.component';
import { ControlNavbarComponent } from './control-navbar/control-navbar.component';
import { ScenariosComponent } from './scenarios/scenarios.component';

// NOTE: CodeMirror's module for code displaying
import { CodemirrorModule } from '@ctrl/ngx-codemirror';


@NgModule({
  imports: [
    CommonModule,
    CodemirrorModule
  ],
  declarations: [ControlPageRootComponent, ControlNavbarComponent, ScenariosComponent],
  // NOTE: Adding a custom elements schema in order to work with CodeMirror's custom component
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ControlPageRootComponent]
})
export class ContorlPageModule { }
