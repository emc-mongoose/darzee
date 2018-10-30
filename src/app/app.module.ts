import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContorlPageModule } from './contorl-page/contorl-page.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // NOTE: Custom modules
    ContorlPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
