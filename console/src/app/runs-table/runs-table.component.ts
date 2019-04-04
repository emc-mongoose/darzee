import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { Router } from '@angular/router';
import { RoutesList } from '../Routing/routes-list';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { timer, Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MongooseRunStatus } from '../core/mongoose-run-status';

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
    this.runRecordsSubscription = this.mongooseRunRecords$.subscribe(updatedRecords => {
      console.log("runs table component subscribe");
      this.handleRecordsUpdate(updatedRecords);
    });
  }

  ngOnDestroy() {
    this.runRecordsSubscription.unsubscribe();
    this.statusUpdateSubscription.unsubscribe();
  }

  // MARK: - Public 

  public onRunStatusIconClicked(mongooseRunRecord: MongooseRunRecord) {
    let clickedRunStatus = mongooseRunRecord.getStatus();
    if (clickedRunStatus == MongooseRunStatus.Unavailable) {
      let misleadingMsg = "Selected Mongoose run info (load step id: " + mongooseRunRecord.getIdentifier() + ") couldn't be found.";
      alert(misleadingMsg);
      return;
    }
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS, mongooseRunRecord.getIdentifier()]);
  }

  // MARK: - Private 

  private updateSingleRecordStatus(runRecord: MongooseRunRecord) {
    let recordStatus = runRecord.getStatus();
    if ((recordStatus == MongooseRunStatus.Finished)) {
      return;
    }

    this.statusUpdateSubscription.add(this.monitoringApiService.getStatusForRecord(runRecord).subscribe(
      status => {
        let configurationIndex = 0;
        let finalMetricsIndex = 1;

        let hasReceivedConfiguration = status[configurationIndex] as boolean;
        runRecord.hasConfig = hasReceivedConfiguration;

        let hasReceivedFinalMetrics = (status[finalMetricsIndex] as boolean);
        runRecord.hasTotalFile = hasReceivedFinalMetrics;
      },
      error => {
        // NOTE: If an error has occured, set status 'Finished'. 
        // It could be possible that there's still some records about Mongoose ...
        // ... run in Prometheus, yet Mongoose image could be reloaded and the data ...
        // ... could be erased. 
        console.log("Got error: ", error);
        let stringPrimitiveType = "string";
        let isErrorContainingMetricName = ((error instanceof String) || (typeof (error) == stringPrimitiveType));
        if (!isErrorContainingMetricName) {
          runRecord.setStatus(MongooseRunStatus.Finished);
          return;
        }
        let requestedMetricName = error;
        switch (requestedMetricName) {
          case "Config": {
            runRecord.hasConfig = false;
            break;
          }
          case "metrics.threshold.FileTotal": {
            console.log("FileTotal error has been received.");
            // NOTE: If FileTotal hasn't been found, Mongoose is still running. 
            runRecord.hasTotalFile = false;
            break;
          }
        }
        runRecord.updateStatus();
      },
      () => {
        // TODO: Update tabs here 
        runRecord.updateStatus();
      }));
  }

  private setInitialRecords(records: MongooseRunRecord[]) {
    // NOTE: Initial set up of run records.
    this.mongooseRunRecords = records;
    console.log("Updating status for records..");
    this.mongooseRunRecords = this.updateStatusForRecords(this.mongooseRunRecords);
  }

  private shouldUpdateStatus(runRecord: MongooseRunRecord): boolean {
    // NOTE: Updating only available and active mongoose runs. 
    console.log("runRecord.getStatus(): ", runRecord.getStatus());
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
        console.log("Record won't be updated.");
        continue;
      }
      this.updateSingleRecordStatus(processingRecord);
    }
    return records;
  }

  private handleRecordsUpdate(updatedRecords: MongooseRunRecord[]) {
    this.mongooseRunRecords = updatedRecords;
    // if (this.mongooseRunRecords.length == 0) {
    //   this.setInitialRecords(updatedRecords);
    //   return;
    // }

    // let shouldUpdateExistingRecords = this.shouldUpdateExistingRecords(updatedRecords);
    // if (!shouldUpdateExistingRecords) {
    //   return;
    // }

    // let hasDeletedElements = (this.mongooseRunRecords.length < updatedRecords.length);
    // if (hasDeletedElements) {
    //   // NOTE: Deleted elements 
    //   this.mongooseRunRecords = this.innerJoinMongooseRecords(this.mongooseRunRecords, updatedRecords);
    // } else {
    //   // NOTE: Added elements 
    //   this.mongooseRunRecords = this.outerJoinMongooseRecords(this.mongooseRunRecords, updatedRecords);
    // }

    // this.mongooseRunRecords = this.updateStatusForRecords(this.mongooseRunRecords);
  }

  // NOTE: Erasing lhsRecords that are not inside rhsRecords list.
  private innerJoinMongooseRecords(lhsRecords: MongooseRunRecord[], rhsRecords: MongooseRunRecord[]): MongooseRunRecord[] {
    console.log("Updating due to deleted elements.");
    console.log("lhsRecords.length :", lhsRecords.length);
    console.log("rhsRecords.length: ", rhsRecords.length);

    var recordsListAfterErasing: MongooseRunRecord[] = [];
    // NOTE: Retaining only non-deleted elements. 
    // It's possible since the order retains. 
    for (var i = 0; i < lhsRecords.length; i++) {
      var isRecordExist = false;
      rhsRecords.forEach(updatedRecord => {
        isRecordExist = (updatedRecord.getIdentifier() == lhsRecords[i].getIdentifier());
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
