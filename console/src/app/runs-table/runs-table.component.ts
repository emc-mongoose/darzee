import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { Router } from '@angular/router';
import { RoutesList } from '../Routing/routes-list';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { timer, Observable } from 'rxjs';
import { MongooseRunStatus } from '../core/mongoose-run-status';

@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css']
})

export class RunsTableComponent implements OnInit {

  @Input("mongooseRunRecords") mongooseRunRecordsObservable: Observable<MongooseRunRecord[]>;
  public mongooseRunRecords: MongooseRunRecord[] = []; 

  readonly EMPTY_FIELD_DEFAULT_TAG = "-";

  readonly columnHeaders = [
    "Status",
    "Start time",
    "Nodes",
    "Duration",
    "Comment"
  ];

  constructor(private router: Router,
    private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.mongooseRunRecordsObservable.subscribe(updatedRecords => { 

      if (this.mongooseRunRecords.length == 0) { 
        // NOTE: No need in updating records if it hasn't been set before. 
        this.mongooseRunRecords = updatedRecords;
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
        console.log("this.mongooseRunRecords.length :", this.mongooseRunRecords.length );
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

  // MARK: - Public 

  public onRunStatusIconClicked(mongooseRunRecord: MongooseRunRecord) {
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS, mongooseRunRecord.getIdentifier()]);
  }

  // NOTE: Updating run duration for the target run record 
  private updateRecord(targetRecord: MongooseRunRecord) {
    this.monitoringApiService.updateRecord(targetRecord).subscribe(updatedRecord => {
      if (updatedRecord == undefined) {
        return;
      }
      targetRecord.setDuration(updatedRecord.getDuration());
      // targetRecord.status = updatedRecord.getStatus();
    });
  }

  // NOTE: Updating dynamic Mongoose run parameters (run status, run duration).
  private setUpRecordsUpdateTimer() {
    let initialRunTableUpdateDelay = 0;
    let singleRecordStatisticsUpdatePeriod = 3000;
    // timer(initialRunTableUpdateDelay, singleRecordStatisticsUpdatePeriod).subscribe(value => {
    //   this.mongooseRunRecords.forEach(runRecord => {
    //     this.updateRecord(runRecord);
    //   })
    // });
  }

}
