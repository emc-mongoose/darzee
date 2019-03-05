import { Component, OnInit } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/mongoose-run-status';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { MongooseRunTab } from './model/monoose-run-tab.model';
import { slideAnimation } from 'src/app/core/animations';

@Component({
  selector: 'app-runs-table-tabs',
  templateUrl: './runs-table-tabs.component.html',
  styleUrls: ['./runs-table-tabs.component.css'],
  animations: [
    slideAnimation
  ]
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

    // NOTE: Tab "All" is selected by default. 
    this.runTabs[0].isSelected = true; 

    this.displayingRunRecords = this.monitoringApiService.getMongooseRunRecords();
  }

  // MARK: - Public 

  filterRunsByStatus(requiredTab: MongooseRunTab) { 
    // NOTE: I haven't found a better way to set custom background color for bootstrap selected button. 
    // ... so I put a selector "isSelected" and if it's set to 'true', the tab button is highlighted.
   this.runTabs.forEach(tab => {
     if (tab === requiredTab) { 
       tab.isSelected = true; 
       return;
     }
     tab.isSelected = false;
   })

    this.displayingRunRecords = requiredTab.records;
  }

  hasSavedRunRecords(): boolean { 
    return (this.monitoringApiService.getMongooseRunRecords().length > 0);
  }

}
