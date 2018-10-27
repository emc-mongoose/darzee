import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HomepageComponent } from './homepage.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ],
  declarations: [HomepageComponent]
})
export class HomepageModule {
  constructor() {}


}
