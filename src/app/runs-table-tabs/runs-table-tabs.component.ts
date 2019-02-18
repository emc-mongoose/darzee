import { Component, OnInit } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { MongooseRunStatus } from '../core/mongoose-run-status';
import { MongooseRunTab } from './model/monoose-run-tab.model';

@Component({
  selector: 'app-runs-table-tabs',
  templateUrl: './runs-table-tabs.component.html',
  styleUrls: ['./runs-table-tabs.component.css']
})
export class RunsTableTabsComponent implements OnInit {

  displayingRunRecords: MongooseRunRecord[]; 

  runTabs: MongooseRunTab[] = [];

  constructor(private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle

  ngOnInit() {
    for (var runStatus in MongooseRunStatus) { 
      var runsTab = new MongooseRunTab(this.monitoringApiService, runStatus.toString());
      this.runTabs.push(runsTab);
    }
    this.displayingRunRecords = this.monitoringApiService.getMongooseRunRecords();
  }

  // MARK: - Public 
  
  filterRunsByStatus(requiredTab: MongooseRunTab) { 
    this.displayingRunRecords = requiredTab.records;
  }

}
