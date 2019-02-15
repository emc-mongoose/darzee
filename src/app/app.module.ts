import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { IpAddressService } from './core/services/ip-addresses/ip-address.service';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContorlPageModule } from './contorl-page/contorl-page.module';
import { ControlEditingModule } from './control-editing/control-editing.module';
import { NodesModule } from './nodes/nodes.module';

// NOTE: NPM dependencies
import {NgJsonEditorModule} from 'ang-jsoneditor'
import { HeaderComponent } from './header/header.component';
import { RunsTableComponent } from './runs-table/runs-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RunsTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // NOTE: Custom modules
    ContorlPageModule,
    ControlEditingModule, 

    // NOTE: Dependencies
    NodesModule,
    NgJsonEditorModule
  ],
  providers: [IpAddressService],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
