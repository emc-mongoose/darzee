import { Component, OnInit } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/mongoose-run-status';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { MongooseRunTab } from './model/monoose-run-tab.model';
import { slideAnimation } from 'src/app/core/animations';
import { Observable, Subscription, timer, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
  public currentActiveTab: MongooseRunTab;
  
  public filtredRecords$ = new BehaviorSubject<MongooseRunRecord[]>([]);

  private displayingRunRecords: MongooseRunRecord[] = [];
  private mongooseRecordsSubscription: Subscription = new Subscription(); 

  private monitoringApiServiceSubscriptions: Subscription = new Subscription(); ; 
  
  // MARK: - Lifecycle

  constructor(private monitoringApiService: MonitoringApiService) { 
    this.runTabs = this.getActiveTabs(); 
    this.currentActiveTab = this.runTabs[0];
    console.log("Current active tab tag: ", this.currentActiveTab.getTabTag());

  }

  ngOnInit() {
    this.mongooseRecordsSubscription = this.monitoringApiService.getCurrentMongooseRunRecords().subscribe( 
      updatedRecords => { 
        let shouldRefreshPage = this.shouldRefreshPage(this.displayingRunRecords, updatedRecords);
        this.displayingRunRecords = updatedRecords;
        if (shouldRefreshPage) { 
          this.runTabs = this.getActiveTabs();
        }

      }
    )
   
    // NOTE: Tab "All" is selected by default. 
    this.filterRunsByStatus(this.currentActiveTab);
  }

  ngOnDestroy() { 
    this.mongooseRecordsSubscription.unsubscribe(); 
    this.monitoringApiServiceSubscriptions.unsubscribe(); 
  }

  // MARK: - Public 

  public getDesiredRecords(): Observable<MongooseRunRecord[]> { 
    return this.filtredRecords$.asObservable();
  }

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
    this.currentActiveTab = requiredTab; 
    this.monitoringApiServiceSubscriptions = this.monitoringApiService.getMongooseRunRecordsFiltredByStatus(requiredTab.tabTitle).subscribe(
      filtedRecords => { 
        this.filtredRecords$.next(filtedRecords);
      }
    )
    console.log("currentActiveTab: ", this.currentActiveTab.getTabTag());
  }


  private filterRunfiltredRecordsByStatus(records: MongooseRunRecord[], requiredStatus: string): MongooseRunRecord[] {
    if (requiredStatus.toString() == MongooseRunStatus.All) { 
        return records;
      }
      // NOTE: Iterating over existing tabs, filtring them by 'status' property.
      var requiredfiltredRecords: MongooseRunRecord[] = [];
      for (var runRecord of records) { 
        if (runRecord.status == requiredStatus) { 
            requiredfiltredRecords.push(runRecord);
        }
    }
    return requiredfiltredRecords;
}

  public hasSavedRunRecords(): boolean {
    return (this.displayingRunRecords.length > 0);
  }

  public getDisplayingRunRecords() { 
    return this.displayingRunRecords; 
  }

  // MARK: - Private 

  private getActiveTabs(): MongooseRunTab[] {
    var updatedTabs: MongooseRunTab[] = [];
    for (let runStatus in MongooseRunStatus) {
      var runsTab = new MongooseRunTab(this.monitoringApiService, runStatus);
      updatedTabs.push(runsTab);
    }
    return updatedTabs;
  }


  private shouldRefreshPage(currentRecords: MongooseRunRecord[], updatedRecords: MongooseRunRecord[]): boolean { 
     // NOTE: Refreshing page ONLY if amount of Mongoose run records has been changed. 
    return (currentRecords.length != updatedRecords.length); 
  }

}
