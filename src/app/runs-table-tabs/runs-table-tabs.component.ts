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

  readonly ALL_MONGOOSE_RUNS_TAG = "";
  displayingRunRecords: MongooseRunRecord[]; 

  runTabs: MongooseRunTab[] = [];

  constructor(private monitoringApiService: MonitoringApiService) { }

  ngOnInit() {

    for (var runStatus in MongooseRunStatus) { 
      var runsTab = new MongooseRunTab(this.monitoringApiService, runStatus);
      this.runTabs.push(runsTab);
    }


    console.log("Run tabs has been initialized.");
    // var tab: MongooseRunTab = new MongooseRunTab(this.monitoringApiService, MongooseRunStatus.Finished);
    this.displayingRunRecords = this.monitoringApiService.getMongooseRunRecords();
  }

  filterRunsByStatus(status: MongooseRunStatus) { 
    if (status.toString() == this.ALL_MONGOOSE_RUNS_TAG) { 
      this.displayingRunRecords = this.monitoringApiService.getMongooseRunRecords();
      return;
    }
    // NOTE: Erasing the displaying records, filling it up with filtred records afterwards.
    this.displayingRunRecords = []; 
    for (var runRecord of this.monitoringApiService.getMongooseRunRecords()) { 
      if (runRecord.status == status) { 
        this.displayingRunRecords.push(runRecord);
      }
    }
  }

}
