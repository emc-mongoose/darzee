import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MongooseRunStatusIconComponent } from './runs-table/mongoose-run-status-icon/mongoose-run-status-icon.component';

// NOTE: NPM dependencies
import { HeaderComponent } from './header/header.component';

import { ControlApiService } from './core/services/control-api/control-api.service';
import { MonitoringApiService } from './core/services/monitoring-api/monitoring-api.service';
import { RunStatisticsComponent } from './run-statistics/run-statistics.component';
import { RunStatisticLogsComponent } from './run-statistics/run-statistic-logs/run-statistic-logs.component';
import { RunStatisticsChartsComponent } from './run-statistics/run-statistics-charts/run-statistics-charts.component';
import { DateFormatPipe } from './common/date-format-pipe';
import { RunsTableComponent } from './runs-table/runs-table.component';
import { RunsTableRootComponent } from './runs-table/runs-table-root/runs-table-root.component';
import { MongooseSetUpModuleModule } from './modules/mongoose-set-up-module/mongoose-set-up-module.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RunsTableComponent,
    MongooseRunStatusIconComponent,
    RunsTableRootComponent,
    
    RunStatisticsComponent,
    RunStatisticLogsComponent,
    RunStatisticsChartsComponent,
    DateFormatPipe
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MongooseSetUpModuleModule,
    BrowserAnimationsModule,
  ],

  // NOTE: Both Control and Monitoring APIs should be instantiated in module level ...
  // ... since we use it for the set up. 
  providers: [ControlApiService, MonitoringApiService, DateFormatPipe],
  bootstrap: [AppComponent],
  exports: [AppComponent],
})
export class AppModule { }
