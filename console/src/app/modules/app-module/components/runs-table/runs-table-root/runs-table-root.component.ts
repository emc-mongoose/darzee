import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/models/mongoose-run-status';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { MongooseRunTab } from './model/monoose-run-tab.model';
import { slideAnimation } from 'src/app/core/animations';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { MongooseRunRecordCounter } from 'src/app/core/models/run-record-counter';
import { PrometheusError } from 'src/app/common/Exceptions/PrometheusError';
import { BasicChartComponent } from '../../run-statistics/run-statistics-charts/basic-chart/basic-chart.component';
import { MongooseRunStatusIconComponent } from '../mongoose-run-status-icon/mongoose-run-status-icon.component';
import { PrometheusErrorComponent } from '../../common/prometheus-error/prometheus-error.component';

@Component({
  selector: 'app-runs-table-root',
  templateUrl: './runs-table-root.component.html',
  styleUrls: ['./runs-table-root.component.css'],
  animations: [
    slideAnimation
  ]
})

export class RunsTableRootComponent implements OnInit {

  @ViewChild('errorMessageComponent', { read: ViewContainerRef }) errorMessageComponent: ViewContainerRef;
  // NOTE: Each tab displays the specific Mongoose Run Records based on record's status. 
  public runTabs: MongooseRunTab[] = [];
  public currentActiveTab: MongooseRunTab;
  

  private displayingRunRecords: MongooseRunRecord[] = [];

  private mongooseRunTabs$: BehaviorSubject<MongooseRunTab[]> = new BehaviorSubject<MongooseRunTab[]>([]);
  private filtredRecords$ = new BehaviorSubject<MongooseRunRecord[]>([]);
  private currentTab$: BehaviorSubject<MongooseRunTab>;

  private mongooseRecordsSubscription: Subscription = new Subscription();
  private monitoringApiServiceSubscriptions: Subscription = new Subscription();

  // MARK: - Lifecycle

  constructor(private monitoringApiService: MonitoringApiService,
    private resolver: ComponentFactoryResolver) {
    this.setUpInitialTabs();
    this.currentTab$.subscribe(tab => {
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


  ngOnInit() {

    this.mongooseRecordsSubscription = this.monitoringApiService.getMongooseRunRecords().subscribe(
      updatedRecords => {
        // NOTE: Updating tabs here
        let runTableTabs = this.getTabsForRecords(updatedRecords); 
        this.mongooseRunTabs$.next(runTableTabs);
        this.displayingRunRecords = updatedRecords;

      },
      error => {
        this.showErrorComponent(error);
    
        let misleadingMsg = `Unable to load Mongoose run records. Details: `;
        let errorDetails = JSON.stringify(error);
        console.error(misleadingMsg + errorDetails);
      }
    )
  }

  ngOnDestroy() {
    this.mongooseRecordsSubscription.unsubscribe();
    this.monitoringApiServiceSubscriptions.unsubscribe();
    this.mongooseRunTabs$.unsubscribe();
  }

  // MARK: - Public 

  public getDesiredRecords(): Observable<MongooseRunRecord[]> {
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
    this.monitoringApiServiceSubscriptions = this.monitoringApiService.getMongooseRunRecordsFiltredByStatus(requiredTab.tabTitle).subscribe(
      (filtedRecords: MongooseRunRecord[]) => {
        requiredTab.setAmountOfRecords(filtedRecords.length);
        this.filtredRecords$.next(filtedRecords);
      },
      (error: PrometheusError): any => { 
        this.showErrorComponent(error);
      }
    )
  }


  public hasSavedRunRecords(): boolean {
    return (this.displayingRunRecords.length > 0);
  }

  public getDisplayingRunRecords() {
    return this.displayingRunRecords;
  }

  public getMongooseRunTabs(): Observable<MongooseRunTab[]> {
    return this.mongooseRunTabs$.asObservable();
  }

  public showErrorComponent(error: Error) { 
    this.errorMessageComponent.clear();

    if (error instanceof PrometheusError) { 
      const factory = this.resolver.resolveComponentFactory(PrometheusErrorComponent);
      const errorComponentReference = this.errorMessageComponent.createComponent(factory);
      errorComponentReference.instance.onPrometheusLoad.subscribe(
        onPrometheusClosed => { 
          this.errorMessageComponent.clear();
        }
      );
    }
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

}
