import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../../../../core/models/run-record.model';
import { Router } from '@angular/router';
import { RoutesList } from '../../Routing/routes-list';
import { MonitoringApiService } from '../../../../core/services/monitoring-api/monitoring-api.service';
import { timer, Observable, Subscription } from 'rxjs';

import { MongooseRunStatus } from '../../../../core/models/mongoose-run-status';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';

@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css']
})

export class RunsTableComponent implements OnInit {

  public readonly MONGOOSE_LOADING_RUN_MSG = "Loading Mongoose run. This can take up to 20 seconds.."
  public readonly EMPTY_FIELD_DEFAULT_TAG = "-";
  public readonly columnHeaders = [
    "Status",
    "Start time",
    "Nodes",
    "Duration [s]",
    "Comment"
  ];

  @Input("mongooseRunRecords") mongooseRunRecords$: Observable<MongooseRunRecord[]>;
  public mongooseRunRecords: MongooseRunRecord[] = [];

  private runRecordsSubscription: Subscription = new Subscription();
  private statusUpdateSubscription: Subscription = new Subscription();

  constructor(private router: Router,
    private mongooseDataSharedServiceService: MongooseDataSharedServiceService) { }

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

  public shouldAppearLoadSpinner(): boolean {
    return this.mongooseDataSharedServiceService.shouldWaintForNewRun;
  }

  public getDisplayingTimeForRecord(record: MongooseRunRecord): string { 
    let unixEpochStartTime = record.getStartTime(); 
    let displayingDate = new Date(Number.parseInt(unixEpochStartTime as string));
    return displayingDate.toString();
  }

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

  private setInitialRecords(records: MongooseRunRecord[]) {
    // NOTE: Initial set up of run records.
    this.mongooseRunRecords = records;
    this.mongooseRunRecords = this.updateStatusForRecords(this.mongooseRunRecords);
  }

  private shouldUpdateStatus(runRecord: MongooseRunRecord): boolean {
    // NOTE: Updating only available and active mongoose runs. 
    return ((runRecord.getStatus() != MongooseRunStatus.Finished) && (runRecord.getStatus() != MongooseRunStatus.Unavailable));
  }

  private shouldUpdateExistingRecords(updatedRecords: MongooseRunRecord[]): boolean {
    // NOTE: As for now, update it only if amount of record has been changed. 
    return (this.mongooseRunRecords.length != updatedRecords.length);
  }

  private updateStatusForRecords(records: MongooseRunRecord[]): MongooseRunRecord[] {
    for (var i = 0; i < records.length; i++) {
      let processingRecord = records[i];
      if (!this.shouldUpdateStatus(processingRecord)) {
        continue;
      }
    }
    return records;
  }

  private handleRecordsUpdate(updatedRecords: MongooseRunRecord[]) {
    this.mongooseRunRecords = updatedRecords;
  }

  // NOTE: Erasing lhsRecords that are not inside rhsRecords list.
  private innerJoinMongooseRecords(lhsRecords: MongooseRunRecord[], rhsRecords: MongooseRunRecord[]): MongooseRunRecord[] {
    var recordsListAfterErasing: MongooseRunRecord[] = [];
    // NOTE: Retaining only non-deleted elements. 
    // It's possible since the order retains. 
    for (var i = 0; i < lhsRecords.length; i++) {
      var isRecordExist = false;
      rhsRecords.forEach(updatedRecord => {
        isRecordExist = (updatedRecord.getLoadStepId() == lhsRecords[i].getLoadStepId());
        if (isRecordExist) {
          return;
        }
      })

      if (isRecordExist) {
        // NOTE: Retain element if it hasn't been deleted.
        recordsListAfterErasing.push(lhsRecords[i]);
      }
    }
    return recordsListAfterErasing;
  }

  // NOTE: Merging rhsRecords elements that are not in the lhsRecords list. 
  private outerJoinMongooseRecords(lhsRecords: MongooseRunRecord[], rhsRecords: MongooseRunRecord[]): MongooseRunRecord[] {
    // NOTE: Slice is possible since records are sorted by a start time. 
    let addedRecords = rhsRecords.slice(this.mongooseRunRecords.length, rhsRecords.length);
    for (var addedRecord of addedRecords) {
      lhsRecords.push(addedRecord);
    }
    return lhsRecords;
  }
}
