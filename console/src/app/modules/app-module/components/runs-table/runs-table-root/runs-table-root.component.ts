import { Component, OnInit } from "@angular/core";
import { slideAnimation } from "src/app/core/animations";
import { MongooseRunTab } from "./model/monoose-run-tab.model";
import { MongooseRunRecord } from "src/app/core/models/mongoose-run-record/run-record.model";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { MongooseRunRecordCounter } from "src/app/core/models/mongoose-run-record/run-record-counter";
import { MongooseRunStatus } from "src/app/core/models/mongoose-run-record/mongoose-run-status";

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

  private displayingRunRecords: MongooseRunRecord[] = [];

  private mongooseRunTabs$: BehaviorSubject<MongooseRunTab[]> = new BehaviorSubject<MongooseRunTab[]>([]);
  private filtredRecords$ = new BehaviorSubject<MongooseRunRecord[]>([]);
  private currentTab$: BehaviorSubject<MongooseRunTab>;

  private mongooseRecordsSubscription: Subscription = new Subscription();
  private monitoringApiServiceSubscriptions: Subscription = new Subscription();;

  // MARK: - Lifecycle

  constructor(private monitoringApiService: MonitoringApiService) {
    this.setUpInitialTabs();
    this.mongooseRecordsSubscription.add(
      this.getTabUpdatingSubscription()
    );
  }


  ngOnInit() {

    this.mongooseRecordsSubscription.add(this.getRecordsUpdateSusbcription())
  }

  ngOnDestroy() {
    this.mongooseRecordsSubscription.unsubscribe();
    this.monitoringApiServiceSubscriptions.unsubscribe();
    this.mongooseRunTabs$.unsubscribe();
  }

  // MARK: - Public 

  public getFiltredRecords(): Observable<MongooseRunRecord[]> {
    return this.filtredRecords$.asObservable();
  }

  public onStatusTabClick(requiredTab: MongooseRunTab) {
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
    this.currentTab$.next(requiredTab);

    this.monitoringApiServiceSubscriptions = this.monitoringApiService.getMongooseRunRecordsFiltredByStatus(requiredTab.tabTitle).subscribe(
      filtedRecords => {
        requiredTab.setAmountOfRecords(filtedRecords.length);
        this.filtredRecords$.next(filtedRecords);
      }
    )
  }


  public hasSavedRunRecords(): boolean {
    return (this.displayingRunRecords.length > 0);
  }

  public getDisplayingRunRecords(): MongooseRunRecord[] {
    return this.displayingRunRecords;
  }

  public getMongooseRunTabs(): Observable<MongooseRunTab[]> {
    return this.mongooseRunTabs$.asObservable();
  }

  // MARK: - Private 

  private getTabsForRecords(records: MongooseRunRecord[]): MongooseRunTab[] {
    let tabs: MongooseRunTab[] = [];
    let mongooseRunRecordCounter = new MongooseRunRecordCounter();
    for (let runStatus in MongooseRunStatus) {
      let amountOfRecordsInTab$ = mongooseRunRecordCounter.getAmountOfRecordsWithStatus$(records, runStatus);
      let runTab = new MongooseRunTab(amountOfRecordsInTab$, runStatus);
      tabs.push(runTab);
    }
    return tabs;
  }


  private setUpInitialTabs() {
    let emptyMongooseRunRecords: MongooseRunRecord[] = [];
    this.runTabs = this.getTabsForRecords(emptyMongooseRunRecords);
    if (this.runTabs.length <= 0) {
      // TODO: Change logic of displaying records
      this.displayingRunRecords = [];
      return;
    }
    let initialTab = this.runTabs[0];
    this.currentTab$ = new BehaviorSubject<MongooseRunTab>(initialTab);
  }



  // NOTE: Handling tabs updation based on the fetched records. 
  private getTabUpdatingSubscription(): Subscription {
    return this.currentTab$.subscribe(tab => {
      let targetStatus = tab.getStatus();
      this.monitoringApiServiceSubscriptions.add(
        this.monitoringApiService.getMongooseRunRecordsFiltredByStatus(targetStatus).subscribe(
          records => {
            console.log("Records have been changed.");
            this.filtredRecords$.next(records);
          },
          error => {
            console.error(`Unable to filter records by status "${targetStatus}. Details: ${error}"`);
            this.displayingRunRecords = [];
          }
        )
      )
    });
  }

  private getRecordsUpdateSusbcription(): Subscription {
    return this.monitoringApiService.getMongooseRunRecords().subscribe(
      updatedRecords => {
        // NOTE: Updating tabs here 
        let updatedTabs = this.getTabsForRecords(updatedRecords)
        this.mongooseRunTabs$.next(updatedTabs);
        this.displayingRunRecords = updatedRecords;

      },
      error => {
        let misleadingMsg = `Unable to load Mongoose run records. Details: `;

        let errorDetails = JSON.stringify(error);
        console.error(misleadingMsg + errorDetails);

        let errorCause = error;
        alert(misleadingMsg + errorCause);
        alert(`Unable to load Mongoose runs. Details: ${error}`);
      }
    )
  }
}
