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
  public runTabs: MongooseRunTab[] = [];

  private displayingRunRecords: MongooseRunRecord[] = [];
  private mongooseRecordsSubscription: Subscription = new Subscription(); 
  private runTableUpdateTimerSunscription: Subscription = new Subscription(); 

  private monitoringApiServiceSubscriptions: Subscription; 
  // MARK: - Lifecycle

  constructor(private monitoringApiService: MonitoringApiService) { }

  ngOnInit() {
    this.mongooseRecordsSubscription = this.monitoringApiService.getCurrentMongooseRunRecords().subscribe( 
      updatedRecords => { 
        let shouldRefreshPage = this.shouldRefreshPage(this.displayingRunRecords, updatedRecords);
        this.displayingRunRecords = updatedRecords;
        if (shouldRefreshPage) { 
          this.updateTabs(); 
        }

      }
    )
    this.updateTabs();
    // NOTE: Tab "All" is selected by default. 
    this.filterRunsByStatus(this.runTabs[0]);
  }

  ngOnDestroy() { 
    this.mongooseRecordsSubscription.unsubscribe(); 
    this.runTableUpdateTimerSunscription.unsubscribe();
  }

  // MARK: - Public 

  public filterRunsByStatus(requiredTab: MongooseRunTab) {
    // NOTE: I haven't found a better way to set custom background color for bootstrap selected button. 
    // ... so I put a selector "isSelected" and if it's set to 'true', the tab button is highlighted.
    this.runTabs.forEach(tab => {
      if (tab === requiredTab) {
        tab.isSelected = true;
        return;
      }
      tab.isSelected = false;
    })
  }

  hasSavedRunRecords(): boolean {
    return (this.displayingRunRecords.length > 0);
  }

  public getDisplayingRunRecords() { 
    return this.displayingRunRecords; 
  }

  // MARK: - Private 

  private updateTabs() {
    var updatedTabs: MongooseRunTab[] = [];
    for (var runStatus in MongooseRunStatus) {
      var runsTab = new MongooseRunTab(this.monitoringApiService, runStatus.toString());
      updatedTabs.push(runsTab);
    }
    this.runTabs = updatedTabs;
  }


  private shouldRefreshPage(currentRecords: MongooseRunRecord[], updatedRecords: MongooseRunRecord[]): boolean { 
     // NOTE: Refreshing page ONLY if amount of Mongoose run records has been changed. 
    return (currentRecords.length != updatedRecords.length); 
  }

}
