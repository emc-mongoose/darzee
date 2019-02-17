import { Component, OnInit } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { MongooseRunStatus } from '../core/mongoose-run-status';

@Component({
  selector: 'app-runs-table-tabs',
  templateUrl: './runs-table-tabs.component.html',
  styleUrls: ['./runs-table-tabs.component.css']
})
export class RunsTableTabsComponent implements OnInit {

  readonly ALL_MONGOOSE_RUNS_TAG = "";
  displayingRunRecords: MongooseRunRecord[]; 

  constructor(private monitoringApiService: MonitoringApiService) { }

  ngOnInit() {
    console.log("Run tabs has been initialized.");
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
