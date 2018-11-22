import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
// import { NodesComponent } from './nodes/nodes.component';
import { IpAddressService } from './ip-address.service';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContorlPageModule } from './contorl-page/contorl-page.module';
import { ControlEditingModule } from './control-editing/control-editing.module';
import { NodesModule } from './nodes/nodes.module';

@NgModule({
  declarations: [
    AppComponent,
    // NodesComponent
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
    NodesModule
  ],
  providers: [IpAddressService],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
