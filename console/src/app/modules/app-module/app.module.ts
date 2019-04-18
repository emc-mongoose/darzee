import { NgModule } from "@angular/core";
import { AppComponent } from "./components/app-component/app.component";
import { HeaderComponent } from "src/app/header/header.component";
import { RunsTableComponent } from "./components/runs-table/runs-table.component";
import { MongooseRunStatusIconComponent } from "./components/runs-table/mongoose-run-status-icon/mongoose-run-status-icon.component";
import { RunsTableRootComponent } from "./components/runs-table/runs-table-root/runs-table-root.component";
import { RunStatisticsComponent } from "./components/run-statistics/run-statistics.component";
import { RunStatisticLogsComponent } from "./components/run-statistics/run-statistic-logs/run-statistic-logs.component";
import { RunStatisticsChartsComponent } from "./components/run-statistics/run-statistics-charts/run-statistics-charts.component";
import { DateFormatPipe } from "src/app/common/date-format-pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./Routing/app-routing.module";
import { MongooseSetUpModuleModule } from "../mongoose-set-up-module/mongoose-set-up-module.module";
import { ControlApiService } from "src/app/core/services/control-api/control-api.service";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

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
    BrowserAnimationsModule
    ],

  // NOTE: Both Control and Monitoring APIs should be instantiated in module level ...
  // ... since we use it for the set up. 
  providers: [ControlApiService, MonitoringApiService, DateFormatPipe],
  bootstrap: [AppComponent],
  exports: [AppComponent],
})
export class AppModule { }
