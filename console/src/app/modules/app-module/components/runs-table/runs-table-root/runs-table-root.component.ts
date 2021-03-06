import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, ComponentRef, OnDestroy } from "@angular/core";
import { slideAnimation } from "src/app/core/animations";
import { MongooseRunTab } from "./model/monoose-run-tab.model";
import { MongooseRunRecord } from "src/app/core/models/run-record.model";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { MongooseDataSharedServiceService } from "src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service";
import { PrometheusError } from "src/app/common/Exceptions/PrometheusError";
import { PrometheusErrorComponent } from "../../common/prometheus-error/prometheus-error.component";
import { MongooseRunRecordCounter } from "src/app/core/models/run-record-counter";
import { MongooseRunStatus } from "src/app/core/models/mongoose-run-status";
import { PrometheusApiService } from "src/app/core/services/prometheus-api/prometheus-api.service";
import { SharedLayoutService } from "src/app/core/services/shared-layout-service/shared-layout.service";
import { MongooseNotification } from "src/app/core/services/shared-layout-service/notification/mongoose-notification.model";
import { NotificationComponent } from "src/app/core/services/shared-layout-service/notification/notifications.component";

@Component({
  selector: 'app-runs-table-root',
  templateUrl: './runs-table-root.component.html',
  styleUrls: ['./runs-table-root.component.css'],
  animations: [
    slideAnimation
  ]
})

export class RunsTableRootComponent implements OnInit, OnDestroy {

  @ViewChild('errorMessageComponent', { read: ViewContainerRef }) errorMessageComponent: ViewContainerRef;
  
  public readonly RUN_TABLE_LOADING_MSG = "Loading runs table...";
  // NOTE: Each tab displays the specific Mongoose Run Records based on record's status. 
  public runTabs: MongooseRunTab[] = [];
  public currentActiveTab: MongooseRunTab;

  private displayingRunRecords: MongooseRunRecord[] = [];

  private mongooseRunTabs$: BehaviorSubject<MongooseRunTab[]> = new BehaviorSubject<MongooseRunTab[]>([]);
  private filtredRecords$ = new BehaviorSubject<MongooseRunRecord[]>([]);
  private currentTab$: BehaviorSubject<MongooseRunTab>;

  private mongooseRecordsSubscription: Subscription = new Subscription();
  private monitoringApiServiceSubscriptions: Subscription = new Subscription();
  private prometheusAddressSubscription: Subscription = new Subscription();

  private recordUpdatingTimer: any;

  private hasReceivedDataFromProvider: boolean = false;
  private hasInitializedRecord: boolean = false;
  private errorComponentsReferences: ComponentRef<any>[] = [];

  // MARK: - Lifecycle

  constructor(private monitoringApiService: MonitoringApiService,
    private resolver: ComponentFactoryResolver,
    private mongooseDataSharedServiceService: MongooseDataSharedServiceService,
    private prometheusApiService: PrometheusApiService,
    private sharedLayoutService: SharedLayoutService) { }

  ngOnInit() {
    if (this.mongooseDataSharedServiceService.shouldWaintForNewRun) {
      this.observeLaunchedRunRecord = this.observeLaunchedRunRecord.bind(this);
      this.recordUpdatingTimer = setInterval(this.observeLaunchedRunRecord, 2000);
    }
    this.setupComponent();
  }

  ngOnDestroy() {
    this.mongooseRecordsSubscription.unsubscribe();
    this.monitoringApiServiceSubscriptions.unsubscribe();
    this.prometheusAddressSubscription.unsubscribe();
    this.mongooseRunTabs$.unsubscribe();
    this.currentTab$.unsubscribe();
    this.filtredRecords$.unsubscribe();
  }

  /**
   * Determines if data required for Run Table loading has been received.
   * @returns true if data has been successfully loaded from data provider.
   */
  public hasRunTableInitialized(): boolean {
    return this.hasReceivedDataFromProvider;
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
    });
    this.currentActiveTab = requiredTab;
    this.monitoringApiServiceSubscriptions = this.monitoringApiService.getMongooseRunRecordsFiltredByStatus(requiredTab.tabTitle).subscribe(
      (filtedRecords: MongooseRunRecord[]) => {
        requiredTab.setAmountOfRecords(filtedRecords.length);
        this.filtredRecords$.next(filtedRecords);
      },
      (error: PrometheusError): any => {
        this.showErrorComponent(error);
      }
    );
  }


  public shouldDisplayRecords(): boolean {
    return (this.filtredRecords$.getValue().length > 0);
  }

  public getDisplayingRunRecords() {
    return this.displayingRunRecords;
  }

  public getMongooseRunTabs(): Observable<MongooseRunTab[]> {
    return this.mongooseRunTabs$.asObservable();
  }

  /**
   * Shows specific component that should occure on a specific ...
   * ... errors. 
   * @param error error instance.
   */
  public showErrorComponent(error: Error) {
    this.errorMessageComponent.clear();

    if (error instanceof PrometheusError) {
      const factory = this.resolver.resolveComponentFactory(PrometheusErrorComponent);
      const errorComponentReference = this.errorMessageComponent.createComponent(factory);
      this.errorComponentsReferences.push(errorComponentReference);
      this.prometheusAddressSubscription.add(
        errorComponentReference.instance.onPrometheusLoad.subscribe(
          onPrometheusClosed => {
            this.errorMessageComponent.clear();
            this.setUpRunTableDataSource();
          }
        )
      );
    }
  }
  // MARK: - Private 

  /**
   * @returns tab instances based on Mongoose run @param records . 
   * 
   */
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

  /**
   * Loads run table's data source.
   */
  private setUpRunTableDataSource() {
    this.prometheusAddressSubscription.add(
      this.prometheusApiService.setupPromtheusEntryNode().subscribe(
        (hasPrometheusLoaded: boolean) => {
          if (!hasPrometheusLoaded) {
            const erorr: PrometheusError = new PrometheusError("Prometheus unavailable", 500); // TODO: Replace hard coded values
            this.showErrorComponent(erorr);
            return;
          }
          console.log(`[${RunsTableRootComponent.name}] Data source has successfully loaded.`);
          this.setUpInitialTabs();
          this.initializeTabsRecordsData();
          this.setUpRecordsData();
        }
      )
    );
  }

  /**
   * Initialize basic tab instances.
   */
  private setUpInitialTabs() {
    let emptyMongooseRunRecords: MongooseRunRecord[] = [];
    this.runTabs = this.getTabsForRecords(emptyMongooseRunRecords);
    if (this.runTabs.length <= 0) {
      this.displayingRunRecords = [];
      return;
    }
    let initialTab = this.runTabs[0];
    this.currentTab$ = new BehaviorSubject<MongooseRunTab>(initialTab);
  }


  /**
   * Fullfill every tab (which provides run record status) with the related run records.
   */
  private initializeTabsRecordsData() {
    this.currentTab$.subscribe(tab => {
      let targetStatus = tab.getStatus();
      this.monitoringApiServiceSubscriptions.add(
        this.monitoringApiService.getMongooseRunRecordsFiltredByStatus(targetStatus).subscribe(
          (records: MongooseRunRecord[]) => {
            if (records.length == this.filtredRecords$.getValue().length) {
              return;
            }

            if ((records.length != this.filtredRecords$.getValue().length) && this.hasInitializedRecord) {
              this.mongooseDataSharedServiceService.shouldWaintForNewRun = false;
              clearInterval(this.recordUpdatingTimer);
            }
            console.log("Records have been changed.");
            this.filtredRecords$.next(records);
            this.hasInitializedRecord = true;
          },
          error => {
            console.error(`Unable to filter records by status "${targetStatus}. Details: ${error}"`);
            this.displayingRunRecords = [];
          }
        )
      )
    });
  }

  /**
   * Defines initial state of run table root component.
   */
  private setupComponent() {
    this.setUpRunTableDataSource();
  }

  /**
   * Retrieves existing records from Prometheus. 
   * Note that it will display every existing record on the screen without ...
   * ... keeping status in mind.
   */
  private setUpRecordsData() {
    this.mongooseRecordsSubscription = this.monitoringApiService.getMongooseRunRecords().subscribe(
      updatedRecords => {
        // NOTE: Updating tabs here
        let runTableTabs: MongooseRunTab[] = this.getTabsForRecords(updatedRecords);
        this.mongooseRunTabs$.next(runTableTabs);
        // NOTE: Displaying every fetched records.
        this.displayingRunRecords = updatedRecords;
        this.hasReceivedDataFromProvider = true;
      },
      error => {
        this.showErrorComponent(error);

        let misleadingMsg = `Unable to load Mongoose run records. Details: `;
        let errorDetails = JSON.stringify(error);

        console.error(misleadingMsg + errorDetails);
      }
    );
  }

  /**
 * Observles any launched Mongoose run. 
 * It's useful when Mongoose run has been launched but its data ..
 * ... hasn't been exported to data provider yet. This way we're able to notify...
 * ... user that the run is still there, but need to be loaded.
 */
  private observeLaunchedRunRecord() {
    this.mongooseRecordsSubscription.add(
      this.monitoringApiService.getMongooseRunRecords().subscribe(
        (fetchedRecord: MongooseRunRecord[]) => {
          if (fetchedRecord.length != this.filtredRecords$.getValue().length) {
            this.mongooseDataSharedServiceService.shouldWaintForNewRun = false;
          }
        }
      )
    );
  }

}
