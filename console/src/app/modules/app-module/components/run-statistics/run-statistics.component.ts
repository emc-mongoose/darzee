import { Component, OnInit } from "@angular/core";
import { RoutesList } from "../../Routing/routes-list";
import { MongooseRunRecord } from "src/app/core/models/run-record.model";
import { BasicTab } from "src/app/common/BasicTab/BasicTab";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { RouteParams } from "../../Routing/params.routes";
import { MongooseRunStatus } from "src/app/core/models/mongoose-run-status";
import { ControlApiService } from "src/app/core/services/control-api/control-api.service";


@Component({
  selector: 'app-run-statistics',
  templateUrl: './run-statistics.component.html',
  styleUrls: ['./run-statistics.component.css']
})
export class RunStatisticsComponent implements OnInit {

  private readonly STATISTICS_SECTIONS = [
    { name: "Logs", url: RoutesList.RUN_LOGS },
    { name: "Charts", url: RoutesList.RUN_CHARTS }
  ];

  // NOTE: Displaying run record and related statistic tabs. 
  // Objects are being used within DOM. 
  public runRecord: MongooseRunRecord;
  public statisticTabs: BasicTab[] = [];

  private routeParameters: any;
  private monitoringApiSubscriptions: Subscription;

  // MARK: - Lifecycle 

  constructor(private route: ActivatedRoute,
    private router: Router,
    private monitoringApiService: MonitoringApiService,
    private controlApiService: ControlApiService) {
  }

  ngOnInit() {
    // NOTE: Getting ID of the required Run Record from the HTTP query parameters. 
    this.routeParameters = this.route.params.subscribe(params => {
      let targetRecordLoadStepId = params[RouteParams.ID];
      try {
        this.monitoringApiSubscriptions = this.monitoringApiService.getMongooseRunRecordByLoadStepId(targetRecordLoadStepId).subscribe(
          foundRecord => {
            this.runRecord = foundRecord;
          },
          error => {
            let misleadingMsg = `Unable to display statistics for Mongoose run record with ID ${targetRecordLoadStepId}, reason: ${error.message}`;
            console.error(misleadingMsg);
            alert(misleadingMsg);
            return;
          }
        )
        this.initTabs();
      } catch (recordNotFoundError) {
        // NOTE: Navigating back to 'Runs' page in case record hasn't been found. 
        alert("Unable to load requested record.");
        console.error(recordNotFoundError);
        this.router.navigate([RoutesList.RUNS]);
      }
    });
  }

  ngOnDestroy() {
    this.monitoringApiSubscriptions.unsubscribe();
    this.routeParameters.unsubscribe();
  }

  // MARK: - Public 

  public switchTab(targetTab: BasicTab) {
    this.statisticTabs.forEach(section => {
      if (targetTab.isEqual(section)) {
        section.isActive = true;
        return;
      }
      section.isActive = false;
    });

    this.loadTab(targetTab);
  }

  public isRunActive(runRecord: MongooseRunRecord) { 
    return (runRecord.getStatus() == MongooseRunStatus.Running);
  }

  public onTerminateBtnClicked(runRecord: MongooseRunRecord) { 
    let terminatingRunId = runRecord.getRunId();
    this.controlApiService.terminateMongooseRun(terminatingRunId as string).subscribe(
      (terminationStatusMessage: string) => { 
        alert(terminationStatusMessage);
      }
    );
  }
  // MARK: - Private

  private initTabs() {
    // NOTE: Filling up statistic tabs data  
    for (let section of this.STATISTICS_SECTIONS) {
      let tab = new BasicTab(section.name, section.url);
      this.statisticTabs.push(tab);
    }
    let initialSelectedTabNumber = 0;
    const initialTab = this.statisticTabs[initialSelectedTabNumber];
    initialTab.isActive = true;
    this.loadTab(initialTab);
  }

  private loadTab(selectedTab: BasicTab) {
    if (!this.canStatisticsBeLoadedForRecord(this.runRecord)) {
      console.error(`Unable to load statistics for Mongoose run with id ${this.runRecord.getRunId()} since it doesn't have load step ID.`);
      return;
    }
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS + '/' + this.runRecord.getLoadStepId()
      + '/' + selectedTab.getLink()]);
  }

  private canStatisticsBeLoadedForRecord(record: MongooseRunRecord) {
    let emptyValue = "";
    let hasLoadStepId = (record.getLoadStepId() != emptyValue);
    return hasLoadStepId;
  }

}
