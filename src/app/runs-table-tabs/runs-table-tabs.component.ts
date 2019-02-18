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

  // NOTE: Each tab displays the specific Mongoose Run Records based on record's status. 
  runTabs: MongooseRunTab[] = [];
  displayingRunRecords: MongooseRunRecord[]; 

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
    // NOTE: I haven't found a better way to set custom background color for bootstrap selected button. 
    // ... so I put a selector "isSelected" and if it's set to 'true', the tab button is highlighted.
   this.runTabs.forEach(tab => {
     if (tab == requiredTab) { 
       tab.isSelected = true; 
       return;
     }
     tab.isSelected = false;
   })

    this.displayingRunRecords = requiredTab.records;
  }

}
