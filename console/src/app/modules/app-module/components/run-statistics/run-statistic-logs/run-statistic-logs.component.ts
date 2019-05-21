import { Component, OnInit, Input } from '@angular/core';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { BasicTab } from 'src/app/common/BasicTab/BasicTab';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParams } from 'src/app/modules/app-module/Routing/params.routes';
import { RoutesList } from 'src/app/modules/app-module/Routing/routes-list';
import { Observable, Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MongooseRouteParamsParser } from 'src/app/core/models/mongoose-route-params-praser';
import { MongooseRunEntryNode } from 'src/app/core/services/local-storage-service/MongooseRunEntryNode';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntryNodeSelectionComponent } from '../common/entry-node-selection/entry-node-selection.component';


@Component({
  selector: 'app-run-statistic-logs',
  templateUrl: './run-statistic-logs.component.html',
  styleUrls: ['./run-statistic-logs.component.css']
})
export class RunStatisticLogsComponent implements OnInit {

  // NOTE: Public fields are mostly used within DOM. 
  public logTabs: BasicTab[] = [];
  public displayingLog = '';
  public occuredError: any;

  private processingRunRecord: MongooseRunRecord;
  private currentDisplayingTabId = 0;
  private routeParameters: RouteParams;

  private monitoringApiSubscriptions: Subscription = new Subscription();

  // MARK: - Lifecycle

  constructor(private monitoringApiService: MonitoringApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

    ngOnInit() {}

    ngAfterContentInit() {

    // NOTE: Getting ID of the required Run Record from the HTTP query parameters. 
    this.routeParameters = this.route.parent.params.subscribe(params => {
      let mongooseRouteParamsParser: MongooseRouteParamsParser = new MongooseRouteParamsParser(this.monitoringApiService);
      try {
        this.monitoringApiSubscriptions.add(mongooseRouteParamsParser.getMongooseRunRecordByLoadStepId(params).subscribe(
          foundRecord => {
            this.processingRunRecord = foundRecord;
            if (!this.shouldDisplayLogs(this.processingRunRecord)) {
              // NOTE: Timeout prevents situations when modal view will be created before the parent one. 
              setTimeout(() => this.openEntryNodeSelectionWindow());
            }
          }
        ));
        this.initlogTabs();
      } catch (recordNotFoundError) {
        // NOTE: Navigating back to 'Runs' page in case record hasn't been found. 
        alert(`Unable to load requested record information. Reason: ${recordNotFoundError.message}`);
        console.error(recordNotFoundError);
        this.router.navigate([RoutesList.RUNS]);
      }
    });
  }
  

  ngOnDestroy() {
    this.monitoringApiSubscriptions.unsubscribe();
  }

  // MARK: - Public

  public changeDisplayingLog(selectedTab: BasicTab) {
    // TODO: Change logic of setting 'active' status to a selected tab.
    this.logTabs.forEach(tab => {
      let isSelectedTab = (tab.getName() == selectedTab.getName());
      tab.isActive = isSelectedTab ? true : false;
    })


    let logApiEndpoint = this.monitoringApiService.getLogApiEndpoint(selectedTab.getName());
    // NOTE: Resetting error's inner HTML 
    let emptyErrorHtmlValue = "";
    this.occuredError = emptyErrorHtmlValue;

    this.monitoringApiService.getLog(this.processingRunRecord.getEntryNodeAddress(), this.processingRunRecord.getLoadStepId(), logApiEndpoint).subscribe(
      logs => {
        this.displayingLog = logs;
      },
      error => {
        var misleadingMessage = `Requested target doesn't seem to exist. Details: ${error}`;
        this.displayingLog = misleadingMessage;
        this.occuredError = error.error;
      }
    );
  }

  public shouldDisplayLogs(record: MongooseRunRecord): boolean { 
    if (record == undefined) { 
      return false; 
    }
    return (record.getEntryNodeAddress() != MongooseRunEntryNode.ADDRESS_NOT_EXIST);
  }

  public openEntryNodeSelectionWindow() { 
    const entryRunNodeEntranceScreenReference = this.modalService.open(EntryNodeSelectionComponent, {ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-blue-backdrop'});
    entryRunNodeEntranceScreenReference.componentInstance.mongooseRunRecord = this.processingRunRecord;
    entryRunNodeEntranceScreenReference.result.then(
      (result) => {
        console.log(`[run statistic logs] result: ${result}`);
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      console.log(`[run statistic logs] reason: ${reason}`);

      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // MARK: - Private

  private initlogTabs() {
    let availableLogNames = this.monitoringApiService.getAvailableLogNames();
    for (let logName of availableLogNames) {
      let TAB_LINK_MOCK = "/";
      let tab = new BasicTab(logName, TAB_LINK_MOCK);
      this.logTabs.push(tab);
    }
    const initialTab = this.logTabs[this.currentDisplayingTabId];
    initialTab.isActive = true;
    this.changeDisplayingLog(initialTab);
  }
}
