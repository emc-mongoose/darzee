import { Component, OnInit } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/mongoose-run-status';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { MongooseRunTab } from './model/monoose-run-tab.model';
import { slideAnimation } from 'src/app/core/animations';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-runs-table-root',
  templateUrl: './runs-table-root.component.html',
  styleUrls: ['./runs-table-root.component.css'],
  animations: [
    slideAnimation
  ]
})

export class RunsTableRootComponent implements OnInit {

  // NOTE: Each tab displays the specific Mongoose Run Records based on record's status. 
  runTabs: MongooseRunTab[] = [];
  private displayingRunRecords: MongooseRunRecord[] = [];

  // MARK: - Lifecycle

  constructor(private monitoringApiService: MonitoringApiService) { }

  ngOnInit() {
    this.setUpMongooseRunRecordsUpdateTimer();
    this.updateRunRecords();
    this.updateTabs();
    // NOTE: Tab "All" is selected by default. 
    this.filterRunsByStatus(this.runTabs[0]);
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
    return (this.monitoringApiService.getExistingRunRecords().length > 0);
  }

  public getDisplayingRunRecords() { 
    return this.displayingRunRecords; 
  }

  // MARK: - Private 

  private updateRunRecords() {
    this.monitoringApiService.getMongooseRunRecords().subscribe(updatedRecords => {
      // NOTE: If an update has been received = updating the values 
      let hasReceivedUpdate: boolean = !(updatedRecords.length == this.displayingRunRecords.length);
      if (hasReceivedUpdate) {
        this.displayingRunRecords = updatedRecords;
        this.updateTabs();
      }
    })
  }

  private updateTabs() {
    var updatedTabs: MongooseRunTab[] = [];
    for (var runStatus in MongooseRunStatus) {
      var runsTab = new MongooseRunTab(this.monitoringApiService, runStatus.toString());
      updatedTabs.push(runsTab);
    }
    this.runTabs = updatedTabs;
  }

  private setUpMongooseRunRecordsUpdateTimer() {
    let initialRunTableUpdateDelay = 0;
    let runTableUpdatePeriodMs = 10000;
    timer(initialRunTableUpdateDelay, runTableUpdatePeriodMs).subscribe(value => {
      this.monitoringApiService.fetchMongooseRunRecords();
    });
  }

}
