import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { IpAddressService } from './core/services/ip-addresses/ip-address.service';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// NOTE: NPM dependencies
import { HeaderComponent } from './header/header.component';
import { RunsTableComponent } from './runs-table/runs-table.component';
import { MongooseRunStatusIconComponent } from './mongoose-run-status-icon/mongoose-run-status-icon.component';
import { RunsTableTabsComponent } from './runs-table-tabs/runs-table-tabs.component';
import { MongooseSetUpComponent } from './mongoose-set-up/mongoose-set-up.component';
import { NodesComponent } from './set-up-steps/nodes/nodes.component';
import { ScenariosComponent } from './set-up-steps/scenarios-set-up/scenarios/scenarios.component';
  // NOTE: CodeMirror's module for code displaying
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
  // NOTE: a module that provides functionality to display JSON as a tree
import {NgJsonEditorModule} from 'ang-jsoneditor'
import { ConfigurationEditingRootComponent } from './set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component';
import { ConfigurationEditingComponent } from './set-up-steps/configuration-set-up/configuration-editing/configuration-editing.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RunsTableComponent,
    MongooseRunStatusIconComponent,
    RunsTableTabsComponent,
    MongooseSetUpComponent,
    NodesComponent,
    ScenariosComponent,
    ConfigurationEditingRootComponent,
    ConfigurationEditingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // NOTE: Dependencies
    NgJsonEditorModule,
    CodemirrorModule
  ],

  providers: [IpAddressService],
  bootstrap: [AppComponent],
  exports: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
