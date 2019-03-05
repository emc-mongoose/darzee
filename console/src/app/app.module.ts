import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MongooseRunStatusIconComponent } from './runs-table/mongoose-run-status-icon/mongoose-run-status-icon.component';
import { RunsTableTabsComponent } from './runs-table/runs-table-tabs/runs-table-tabs.component';
import { NodesComponent } from './mongoose-set-up/set-up-steps/nodes/nodes.component';
import { ScenariosComponent } from './mongoose-set-up/set-up-steps/scenarios-set-up/scenarios/scenarios.component';
import { ConfigurationEditingComponent } from './mongoose-set-up/set-up-steps/configuration-set-up/configuration-editing/configuration-editing.component';
import { ConfigurationEditingRootComponent } from './mongoose-set-up/set-up-steps/configuration-set-up/control-editing-root/control-editing-root.component';

// NOTE: NPM dependencies
import { HeaderComponent } from './header/header.component';
import { RunsTableComponent } from './runs-table/runs-table.component';
import { MongooseSetUpComponent } from './mongoose-set-up/mongoose-set-up.component';
  // NOTE: CodeMirror's module for code displaying
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
  // NOTE: a module that provides functionality to display JSON as a tree
import {NgJsonEditorModule} from 'ang-jsoneditor';
import { SetUpFooterComponent } from './mongoose-set-up/set-up-footer/set-up-footer.component';
import { ControlApiService } from './core/services/control-api/control-api.service';
import { MonitoringApiService } from './core/services/monitoring-api/monitoring-api.service';
import { RunStatisticsComponent } from './run-statistics/run-statistics.component';
import { RunStatisticLogsComponent } from './run-statistics/run-statistic-logs/run-statistic-logs.component';
import { RunStatisticsChartsComponent } from './run-statistics/run-statistics-charts/run-statistics-charts.component';


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
    ConfigurationEditingComponent,
    SetUpFooterComponent,
    RunStatisticsComponent,
    RunStatisticLogsComponent,
    RunStatisticsChartsComponent,
    
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

  // NOTE: Both Control and Monitoring APIs should be instantiated in module level ...
  // ... since we use it for the set up. 
  providers: [ControlApiService, MonitoringApiService],
  bootstrap: [AppComponent],
  exports: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
