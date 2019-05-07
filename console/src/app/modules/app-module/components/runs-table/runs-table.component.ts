import { Component, OnInit, Input } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { MongooseRunRecord } from "src/app/core/models/mongoose-run-record/run-record.model";
import { Router } from "@angular/router";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { RoutesList } from "../../Routing/routes-list";
import { MongooseRunStatus } from "src/app/core/models/mongoose-run-record/mongoose-run-status";

@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css']
})

export class RunsTableComponent implements OnInit {

  readonly EMPTY_FIELD_DEFAULT_TAG = "-";

  readonly columnHeaders = [
    "Status",
    "Start time",
    "Nodes",
    "Duration",
    "Comment"
  ];

  @Input("mongooseRunRecords") mongooseRunRecords$: Observable<MongooseRunRecord[]>;
  public mongooseRunRecords: MongooseRunRecord[] = [];

  private runRecordsSubscription: Subscription = new Subscription();
  private statusUpdateSubscription: Subscription = new Subscription();

  constructor(private router: Router,
    private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle 

  ngOnInit() {

    this.runRecordsSubscription = this.mongooseRunRecords$.subscribe(
      updatedRecords => {
        this.handleRecordsUpdate(updatedRecords);
      },
      error => {
        alert(`Unable to update Mongoose run records table. Details: ${error}`);
      });
  }

  ngOnDestroy() {
    this.runRecordsSubscription.unsubscribe();
    this.statusUpdateSubscription.unsubscribe();
  }

  // MARK: - Public 

  public onRunStatusIconClicked(mongooseRunRecord: MongooseRunRecord) {
    if (!this.isRunStatisticsReachable(mongooseRunRecord)) {
      let loadStepId = mongooseRunRecord.getLoadStepId();
      let isLoadStepIdSaved = (loadStepId != ""); 
      var misleadingMsg = "";
      if (!isLoadStepIdSaved) { 
        misleadingMsg = `Load step ID hasn't been found for scenario within Mongoose Run ${mongooseRunRecord.getRunId()}`;
      } else { 
        misleadingMsg = `Details about selected Mongoose run haven't been found.`;
      }
  
      alert(misleadingMsg);
      return;
    }
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS, mongooseRunRecord.getLoadStepId()]);
  }

  // MARK: - Private 

  private isRunStatisticsReachable(mongooseRunRecord: MongooseRunRecord): boolean {
    let targetRunStatus = mongooseRunRecord.getStatus()
    let isLoadStepIdExist = (mongooseRunRecord.getLoadStepId() != "");
    let isRunReachableByStatus = (targetRunStatus != MongooseRunStatus.Unavailable);
    return (isRunReachableByStatus && isLoadStepIdExist);
  }


  private handleRecordsUpdate(updatedRecords: MongooseRunRecord[]) {
    this.mongooseRunRecords = updatedRecords;
  }
}
