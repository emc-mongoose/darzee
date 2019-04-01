import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { Router } from '@angular/router';
import { RoutesList } from '../Routing/routes-list';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { timer, Observable, Subscription } from 'rxjs';
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

  @Input("mongooseRunRecords") mongooseRunRecordsObservable: Observable<MongooseRunRecord[]>;
  public mongooseRunRecords: MongooseRunRecord[] = [];

  private runRecordsSubscription: Subscription = new Subscription();
  private statusUpdateSubscription: Subscription = new Subscription();

  constructor(private router: Router,
    private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.runRecordsSubscription = this.mongooseRunRecordsObservable.subscribe(updatedRecords => {

      if (this.mongooseRunRecords.length == 0) {
        // NOTE: Initial set up of run records.
        this.mongooseRunRecords = updatedRecords;
        console.log("Updating status for records..");
        this.updateRecordsStatus(this.mongooseRunRecords);
        return;
      }
      // NOTE: Updating only unfinished runs 
      for (var i = 0; i < this.mongooseRunRecords.length; i++) {
        if (this.mongooseRunRecords[i].getStatus() == MongooseRunStatus.Finished) {
          continue;
        }
        this.mongooseRunRecords[i] = updatedRecords[i];
      }
      let shouldUpdateExistingRecords = (this.mongooseRunRecords.length != updatedRecords.length);
      if (!shouldUpdateExistingRecords) {
        console.log("Shouldn't update records.");
        return;
      }

      let hasDeletedElements = (this.mongooseRunRecords.length < updatedRecords.length);
      if (hasDeletedElements) {
        console.log("Updating due to deleted elements.");
        console.log("this.mongooseRunRecords.length :", this.mongooseRunRecords.length);
        console.log("updatedRecords.length: ", updatedRecords.length);

        var recordsListAfterErasing: MongooseRunRecord[] = [];
        // NOTE: Retaining only non-deleted elements. 
        // It's possible since the order retains. 
        for (var i = 0; i < this.mongooseRunRecords.length; i++) {
          var isRecordExist = false;
          updatedRecords.forEach(updatedRecord => {
            isRecordExist = (updatedRecord.getIdentifier() == this.mongooseRunRecords[i].getIdentifier());
            if (isRecordExist) {
              return;
            }
          })

          if (isRecordExist) {
            // NOTE: Retain element if it hasn't been deleted.
            recordsListAfterErasing.push(this.mongooseRunRecords[i]);
          }
        }
        this.mongooseRunRecords = recordsListAfterErasing;
        return;
      }

      console.log("Updating due to added elements.");
      // NOTE: Append existing array with added elements. 
      let addedRecords = updatedRecords.slice(this.mongooseRunRecords.length, updatedRecords.length);
      for (var addedRecord of addedRecords) {
        this.mongooseRunRecords.push(addedRecord);
      }
    })
    // this.setUpRecordsUpdateTimer();
  }

  ngOnDestroy() {
    this.runRecordsSubscription.unsubscribe();
    this.statusUpdateSubscription.unsubscribe();
  }

  // MARK: - Public 

  public onRunStatusIconClicked(mongooseRunRecord: MongooseRunRecord) {
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS, mongooseRunRecord.getIdentifier()]);
  }


  private updateRecordsStatus(runRecords: MongooseRunRecord[]) {
    runRecords.forEach(record => {
      this.statusUpdateSubscription.add(this.monitoringApiService.getStatusForRecord(record).subscribe(status => {
        console.log("Got status for record:", status);
        record.setStatus(status);
      }));
    });
  }

}
